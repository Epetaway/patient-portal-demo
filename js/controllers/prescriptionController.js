/**
 * Prescription Controller - Prescription Management and Refill Requests
 * Handles prescription viewing, refill requests, and medication management
 */

import authService from '../services/authService.js';
import dataService from '../services/dataService.js';
import notificationService from '../services/notificationService.js';
import ValidationService from '../services/validationService.js';

class PrescriptionController {
    static async showPrescriptions(params = {}) {
        try {
            const pageContent = document.getElementById('page-content');
            const user = authService.getCurrentUser();
            
            if (!user) {
                notificationService.showError('User session not found');
                return;
            }

            // Load prescription data
            const prescriptions = await dataService.getPrescriptionsByPatientId(user.id);

            const prescriptionsHtml = `
                <div class="fade-in">
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2>Prescription Management</h2>
                            <p class="text-muted">View your prescriptions and request refills</p>
                        </div>
                    </div>
                    
                    <!-- Prescription Stats -->
                    <div class="row mb-4">
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">${prescriptions.length}</h3>
                                    <p class="mb-0">Total Prescriptions</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">${prescriptions.filter(p => p.canRefill).length}</h3>
                                    <p class="mb-0">Available for Refill</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-warning text-dark">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">${prescriptions.filter(p => !p.canRefill).length}</h3>
                                    <p class="mb-0">Need Attention</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-info text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">${prescriptions.reduce((sum, p) => sum + p.refillsRemaining, 0)}</h3>
                                    <p class="mb-0">Total Refills Left</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Prescriptions List -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Your Prescriptions</h5>
                                </div>
                                <div class="card-body">
                                    ${this.renderPrescriptionsList(prescriptions)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Refill Modal -->
                <div class="modal fade" id="refillModal" tabindex="-1" aria-labelledby="refillModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="refillModalLabel">Request Refill</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="refillForm">
                                    <input type="hidden" id="prescriptionId" name="prescriptionId">
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Medication</label>
                                        <p class="form-control-plaintext" id="medicationDisplay"></p>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="pharmacy" class="form-label">Preferred Pharmacy</label>
                                        <select class="form-control" id="pharmacy" name="pharmacy" required>
                                            <option value="">Select pharmacy...</option>
                                            <option value="CVS Pharmacy - Main St">CVS Pharmacy - Main St</option>
                                            <option value="Walgreens - Oak Ave">Walgreens - Oak Ave</option>
                                            <option value="Rite Aid - Downtown">Rite Aid - Downtown</option>
                                            <option value="Local Pharmacy">Local Pharmacy</option>
                                        </select>
                                        <div id="pharmacy-error" class="invalid-feedback"></div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="comments" class="form-label">Special Instructions (Optional)</label>
                                        <textarea class="form-control" id="comments" name="comments" rows="3" 
                                                 placeholder="Any special delivery instructions or notes..."></textarea>
                                    </div>
                                    
                                    <div class="alert alert-info">
                                        <i class="bi bi-info-circle me-2"></i>
                                        <small>Refill requests are typically processed within 24-48 hours. You will receive a confirmation once your prescription is ready for pickup.</small>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" onclick="PrescriptionController.submitRefillRequest()">
                                    <i class="bi bi-send me-2"></i>Submit Refill Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            pageContent.innerHTML = prescriptionsHtml;

        } catch (error) {
            console.error('Prescriptions page error:', error);
            notificationService.showError('Failed to load prescription data');
        }
    }

    /**
     * Render prescriptions list
     */
    static renderPrescriptionsList(prescriptions) {
        if (!prescriptions.length) {
            return `
                <div class="text-center py-5">
                    <i class="bi bi-prescription2 fs-1 text-muted mb-3"></i>
                    <h5 class="text-muted">No Prescriptions Found</h5>
                    <p class="text-muted">Contact your healthcare provider to add prescriptions to your account.</p>
                </div>
            `;
        }

        return `
            <div class="row">
                ${prescriptions.map(rx => `
                    <div class="col-lg-6 mb-4">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">${rx.medicationName}</h6>
                                <span class="badge bg-${rx.statusClass}">${rx.status}</span>
                            </div>
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-6">
                                        <small class="text-muted">Dosage</small>
                                        <p class="mb-0 fw-bold">${rx.dosage}</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Frequency</small>
                                        <p class="mb-0">${rx.frequency}</p>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-6">
                                        <small class="text-muted">Prescriber</small>
                                        <p class="mb-0">${rx.prescriber}</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Refills Left</small>
                                        <p class="mb-0 fw-bold ${rx.refillsRemaining > 0 ? 'text-success' : 'text-danger'}">
                                            ${rx.refillsRemaining}
                                        </p>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <small class="text-muted">Current Pharmacy</small>
                                    <p class="mb-0">${rx.pharmacy}</p>
                                </div>
                                
                                ${rx.nextRefillDate ? `
                                    <div class="mb-3">
                                        <small class="text-muted">Next Refill Available</small>
                                        <p class="mb-0">${rx.nextRefillDate}</p>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="card-footer">
                                ${rx.canRefill ? `
                                    <button class="btn btn-primary btn-sm w-100" 
                                            onclick="PrescriptionController.openRefillModal(${rx.id}, '${rx.medicationName}', '${rx.pharmacy}')">
                                        <i class="bi bi-arrow-repeat me-2"></i>Request Refill
                                    </button>
                                ` : `
                                    <button class="btn btn-outline-secondary btn-sm w-100" disabled>
                                        <i class="bi bi-exclamation-triangle me-2"></i>
                                        ${rx.status === 'Needs Approval' ? 'Awaiting Approval' : 'No Refills Available'}
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Open refill modal for specific prescription
     */
    static openRefillModal(prescriptionId, medicationName, currentPharmacy) {
        // Populate modal fields
        document.getElementById('prescriptionId').value = prescriptionId;
        document.getElementById('medicationDisplay').textContent = medicationName;
        
        // Pre-select current pharmacy if available
        const pharmacySelect = document.getElementById('pharmacy');
        if (pharmacySelect) {
            const option = Array.from(pharmacySelect.options).find(opt => opt.value === currentPharmacy);
            if (option) {
                pharmacySelect.value = currentPharmacy;
            }
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('refillModal'));
        modal.show();
    }

    /**
     * Submit refill request
     */
    static async submitRefillRequest() {
        try {
            const form = document.getElementById('refillForm');
            const formData = new FormData(form);
            
            const prescriptionId = parseInt(formData.get('prescriptionId'));
            const pharmacy = formData.get('pharmacy');
            const comments = formData.get('comments');

            // Validate required fields
            if (!pharmacy) {
                notificationService.showError('Please select a pharmacy.');
                return;
            }

            // Show loading state
            const submitBtn = document.querySelector('#refillModal .btn-primary');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
            submitBtn.disabled = true;

            // Submit refill request
            const result = await dataService.requestRefill(prescriptionId, pharmacy);

            if (result.success) {
                notificationService.showSuccess(`${result.message}<br><strong>Confirmation #:</strong> ${result.confirmationNumber}`);
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('refillModal'));
                modal.hide();
                
                // Clear form
                form.reset();
                
                // Refresh prescriptions list after short delay
                setTimeout(() => {
                    this.showPrescriptions();
                }, 1000);
            } else {
                notificationService.showError(result.message);
            }

        } catch (error) {
            console.error('Refill request error:', error);
            notificationService.showError('Failed to submit refill request. Please try again.');
        } finally {
            // Restore button state
            const submitBtn = document.querySelector('#refillModal .btn-primary');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Submit Refill Request';
                submitBtn.disabled = false;
            }
        }
    }
}

// Make globally available
window.PrescriptionController = PrescriptionController;

export default PrescriptionController;