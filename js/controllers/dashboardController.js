/**
 * Dashboard Controller - Mimics ASP.NET Core HomeController
 * Handles dashboard and general pages
 */

import authService from '../services/authService.js';
import dataService from '../services/dataService.js';
import notificationService from '../services/notificationService.js';
import ValidationService from '../services/validationService.js';

class DashboardController {
    /**
     * Show main dashboard
     * Similar to ASP.NET Core Index action
     */
    static async showDashboard(params = {}) {
        try {
            const pageContent = document.getElementById('page-content');
            const user = authService.getCurrentUser();
            
            if (!user) {
                notificationService.showError('User session not found');
                return;
            }

            // Load dashboard data
            const [prescriptions, payments, requests] = await Promise.all([
                dataService.getPrescriptionsByPatientId(user.id),
                dataService.getPaymentsByPatientId(user.id),
                dataService.getInformationRequestsByPatientId(user.id)
            ]);

            const dashboardHtml = `
                <div class="fade-in">
                    <!-- Welcome Header -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2 class="mb-1">Welcome back, ${user.firstName || 'Patient'}!</h2>
                            <p class="text-muted">Here's your healthcare summary</p>
                        </div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="row mb-4">
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-prescription2 fs-2 me-3"></i>
                                        <div>
                                            <h5 class="card-title mb-0">${prescriptions.length}</h5>
                                            <p class="card-text mb-0">Active Prescriptions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-success text-white">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-file-text fs-2 me-3"></i>
                                        <div>
                                            <h5 class="card-title mb-0">${requests.length}</h5>
                                            <p class="card-text mb-0">Information Requests</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-info text-white">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-credit-card fs-2 me-3"></i>
                                        <div>
                                            <h5 class="card-title mb-0">${payments.length}</h5>
                                            <p class="card-text mb-0">Payment History</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-warning text-dark">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-exclamation-triangle fs-2 me-3"></i>
                                        <div>
                                            <h5 class="card-title mb-0">${prescriptions.filter(p => !p.canRefill).length}</h5>
                                            <p class="card-text mb-0">Need Attention</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Main Content Sections -->
                    <div class="row">
                        <!-- Recent Prescriptions -->
                        <div class="col-lg-8 mb-4">
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">Recent Prescriptions</h5>
                                    <a href="#prescriptions" class="btn btn-outline-primary btn-sm">View All</a>
                                </div>
                                <div class="card-body">
                                    ${this.renderRecentPrescriptions(prescriptions.slice(0, 3))}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="col-lg-4 mb-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Quick Actions</h5>
                                </div>
                                <div class="card-body">
                                    <div class="d-grid gap-2">
                                        <a href="#prescriptions" class="btn btn-primary">
                                            <i class="bi bi-prescription2 me-2"></i>Request Refill
                                        </a>
                                        <a href="#requests" class="btn btn-outline-primary">
                                            <i class="bi bi-file-text me-2"></i>New Request
                                        </a>
                                        <a href="#payments" class="btn btn-outline-primary">
                                            <i class="bi bi-credit-card me-2"></i>Make Payment
                                        </a>
                                        <a href="#profile" class="btn btn-outline-secondary">
                                            <i class="bi bi-person me-2"></i>Update Profile
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="row">
                        <div class="col-lg-6 mb-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Recent Requests</h5>
                                </div>
                                <div class="card-body">
                                    ${this.renderRecentRequests(requests.slice(0, 3))}
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-6 mb-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Recent Payments</h5>
                                </div>
                                <div class="card-body">
                                    ${this.renderRecentPayments(payments.slice(0, 3))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            pageContent.innerHTML = dashboardHtml;

        } catch (error) {
            console.error('Dashboard error:', error);
            notificationService.showError('Failed to load dashboard data');
        }
    }

    /**
     * Show information requests page
     */
    static async showRequests(params = {}) {
        try {
            const pageContent = document.getElementById('page-content');
            const user = authService.getCurrentUser();
            
            if (!user) {
                notificationService.showError('User session not found');
                return;
            }

            // Load requests and reference data
            const [requests, requestTypes] = await Promise.all([
                dataService.getInformationRequestsByPatientId(user.id),
                dataService.getRequestTypes()
            ]);

            const requestsHtml = `
                <div class="fade-in">
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2>Information Requests</h2>
                            <p class="text-muted">Submit and track your information requests</p>
                        </div>
                    </div>
                    
                    <!-- New Request Form -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Submit New Request</h5>
                                </div>
                                <div class="card-body">
                                    <form id="newRequestForm">
                                        <div class="row">
                                            <div class="col-md-4 mb-3">
                                                <label for="requestType" class="form-label">Request Type</label>
                                                <select class="form-control" id="requestType" name="requestType" required>
                                                    <option value="">Select request type...</option>
                                                    ${requestTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                                                </select>
                                                <div id="requestType-error" class="invalid-feedback"></div>
                                            </div>
                                            <div class="col-md-8 mb-3">
                                                <label for="description" class="form-label">Description</label>
                                                <textarea class="form-control" id="description" name="description" 
                                                         rows="3" placeholder="Please describe your request..." required></textarea>
                                                <div id="description-error" class="invalid-feedback"></div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary">
                                            <i class="bi bi-send me-2"></i>Submit Request
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Existing Requests -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Your Requests</h5>
                                </div>
                                <div class="card-body">
                                    ${this.renderRequestsList(requests)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            pageContent.innerHTML = requestsHtml;
            
            // Setup form submission
            this.setupNewRequestForm();

        } catch (error) {
            console.error('Requests page error:', error);
            notificationService.showError('Failed to load requests data');
        }
    }

    /**
     * Render recent prescriptions for dashboard
     */
    static renderRecentPrescriptions(prescriptions) {
        if (!prescriptions.length) {
            return '<p class="text-muted">No prescriptions found.</p>';
        }

        return prescriptions.map(rx => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <h6 class="mb-1">${rx.medicationName}</h6>
                    <small class="text-muted">${rx.dosage} - ${rx.frequency}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-${rx.statusClass}">${rx.status}</span>
                    <br>
                    <small class="text-muted">${rx.refillsRemaining} refills left</small>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render recent requests for dashboard
     */
    static renderRecentRequests(requests) {
        if (!requests.length) {
            return '<p class="text-muted">No recent requests.</p>';
        }

        return requests.map(req => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <h6 class="mb-1">${req.type}</h6>
                    <small class="text-muted">${req.dateSubmitted}</small>
                </div>
                <span class="badge bg-${req.statusClass}">${req.status}</span>
            </div>
        `).join('');
    }

    /**
     * Render recent payments for dashboard
     */
    static renderRecentPayments(payments) {
        if (!payments.length) {
            return '<p class="text-muted">No recent payments.</p>';
        }

        return payments.map(payment => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <h6 class="mb-1">${payment.formattedAmount}</h6>
                    <small class="text-muted">${payment.description}</small>
                </div>
                <div class="text-end">
                    <small class="text-muted">${payment.date}</small>
                    <br>
                    <small class="text-success">${payment.method}</small>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render full requests list
     */
    static renderRequestsList(requests) {
        if (!requests.length) {
            return '<p class="text-muted">You haven\'t submitted any information requests yet.</p>';
        }

        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Date Submitted</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.map(req => `
                            <tr>
                                <td>${req.type}</td>
                                <td>${req.description}</td>
                                <td>${req.dateSubmitted}</td>
                                <td><span class="badge bg-${req.statusClass}">${req.status}</span></td>
                                <td>${req.dateUpdated || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Setup new request form submission
     */
    static setupNewRequestForm() {
        const form = document.getElementById('newRequestForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const requestType = formData.get('requestType');
            const description = formData.get('description');
            const user = authService.getCurrentUser();

            // Basic validation
            if (!requestType || !description.trim()) {
                notificationService.showError('Please fill in all required fields.');
                return;
            }

            try {
                const result = await dataService.submitInformationRequest(
                    user.id, 
                    requestType, 
                    description.trim()
                );
                
                if (result.success) {
                    notificationService.showSuccess(result.message);
                    form.reset();
                    
                    // Reload page to show new request
                    setTimeout(() => {
                        this.showRequests();
                    }, 1000);
                } else {
                    notificationService.showError(result.message);
                }
            } catch (error) {
                console.error('Request submission error:', error);
                notificationService.showError('Failed to submit request. Please try again.');
            }
        });
    }
}

// Make globally available
window.DashboardController = DashboardController;

export default DashboardController;