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
        dataService.getInformationRequestsByPatientId(user.id),
      ]);

      const dashboardHtml = `
                <div class="fade-in dashboard-modern">
                    <!-- Welcome Header -->
                    <header class="dashboard-header">
                        <div class="welcome-section">
                            <h1 class="welcome-title">Welcome back, ${user.firstName || 'Patient'}!</h1>
                            <p class="welcome-subtitle">Here's your healthcare summary for today</p>
                        </div>
                        <div class="header-actions">
                            <a href="#prescriptions" class="btn-modern btn-modern-primary">
                                <i class="bi bi-plus-lg"></i>
                                <span>Request Refill</span>
                            </a>
                        </div>
                    </header>
                    
                    <!-- Bento Grid Dashboard -->
                    <div class="bento-grid">
                        <!-- Stat Cards - Compact -->
                        <div class="bento-item bento-stat" data-color="primary">
                            <div class="stat-icon">
                                <i class="bi bi-prescription2"></i>
                            </div>
                            <div class="stat-content">
                                <span class="stat-number">${prescriptions.length}</span>
                                <span class="stat-label">Active Prescriptions</span>
                            </div>
                        </div>
                        
                        <div class="bento-item bento-stat" data-color="success">
                            <div class="stat-icon">
                                <i class="bi bi-file-text"></i>
                            </div>
                            <div class="stat-content">
                                <span class="stat-number">${requests.length}</span>
                                <span class="stat-label">Info Requests</span>
                            </div>
                        </div>
                        
                        <div class="bento-item bento-stat" data-color="info">
                            <div class="stat-icon">
                                <i class="bi bi-credit-card"></i>
                            </div>
                            <div class="stat-content">
                                <span class="stat-number">${payments.length}</span>
                                <span class="stat-label">Payments</span>
                            </div>
                        </div>
                        
                        <div class="bento-item bento-stat" data-color="warning">
                            <div class="stat-icon">
                                <i class="bi bi-exclamation-triangle"></i>
                            </div>
                            <div class="stat-content">
                                <span class="stat-number">${prescriptions.filter(p => !p.canRefill).length}</span>
                                <span class="stat-label">Need Attention</span>
                            </div>
                        </div>
                        
                        <!-- Quick Actions - Spans 2 columns on medium+ -->
                        <div class="bento-item bento-actions">
                            <h3 class="bento-title">Quick Actions</h3>
                            <div class="action-grid">
                                <a href="#prescriptions" class="action-card">
                                    <div class="action-icon"><i class="bi bi-arrow-repeat"></i></div>
                                    <span>Request Refill</span>
                                </a>
                                <a href="#requests" class="action-card">
                                    <div class="action-icon"><i class="bi bi-file-earmark-plus"></i></div>
                                    <span>New Request</span>
                                </a>
                                <a href="#payments" class="action-card">
                                    <div class="action-icon"><i class="bi bi-wallet2"></i></div>
                                    <span>Make Payment</span>
                                </a>
                                <a href="#profile" class="action-card">
                                    <div class="action-icon"><i class="bi bi-person-gear"></i></div>
                                    <span>Update Profile</span>
                                </a>
                            </div>
                        </div>
                        
                        <!-- Recent Prescriptions - Larger card -->
                        <div class="bento-item bento-prescriptions">
                            <div class="bento-header">
                                <h3 class="bento-title">Recent Prescriptions</h3>
                                <a href="#prescriptions" class="bento-link">View All <i class="bi bi-arrow-right"></i></a>
                            </div>
                            <div class="prescription-list">
                                ${this.renderModernPrescriptions(prescriptions.slice(0, 3))}
                            </div>
                        </div>
                        
                        <!-- Recent Requests -->
                        <div class="bento-item bento-requests">
                            <div class="bento-header">
                                <h3 class="bento-title">Recent Requests</h3>
                                <a href="#requests" class="bento-link">View All <i class="bi bi-arrow-right"></i></a>
                            </div>
                            <div class="request-list">
                                ${this.renderModernRequests(requests.slice(0, 2))}
                            </div>
                        </div>
                        
                        <!-- Recent Payments -->
                        <div class="bento-item bento-payments">
                            <div class="bento-header">
                                <h3 class="bento-title">Recent Payments</h3>
                                <a href="#payments" class="bento-link">View All <i class="bi bi-arrow-right"></i></a>
                            </div>
                            <div class="payment-list">
                                ${this.renderModernPayments(payments.slice(0, 2))}
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
        dataService.getRequestTypes(),
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

    return prescriptions
      .map(
        rx => `
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
        `
      )
      .join('');
  }

  /**
   * Render recent requests for dashboard
   */
  static renderRecentRequests(requests) {
    if (!requests.length) {
      return '<p class="text-muted">No recent requests.</p>';
    }

    return requests
      .map(
        req => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <h6 class="mb-1">${req.type}</h6>
                    <small class="text-muted">${req.dateSubmitted}</small>
                </div>
                <span class="badge bg-${req.statusClass}">${req.status}</span>
            </div>
        `
      )
      .join('');
  }

  /**
   * Render recent payments for dashboard
   */
  static renderRecentPayments(payments) {
    if (!payments.length) {
      return '<p class="text-muted">No recent payments.</p>';
    }

    return payments
      .map(
        payment => `
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
        `
      )
      .join('');
  }

  /**
   * Render modern prescriptions for bento dashboard
   */
  static renderModernPrescriptions(prescriptions) {
    if (!prescriptions.length) {
      return '<div class="empty-state-mini"><i class="bi bi-prescription2"></i><p>No prescriptions yet</p></div>';
    }

    return prescriptions
      .map(
        rx => `
            <div class="prescription-card">
                <div class="prescription-info">
                    <span class="prescription-name">${rx.medicationName}</span>
                    <span class="prescription-dosage">${rx.dosage} • ${rx.frequency}</span>
                </div>
                <div class="prescription-meta">
                    <span class="status-pill status-${rx.statusClass}">${rx.status}</span>
                    <span class="refill-count">${rx.refillsRemaining} refills</span>
                </div>
            </div>
        `
      )
      .join('');
  }

  /**
   * Render modern requests for bento dashboard
   */
  static renderModernRequests(requests) {
    if (!requests.length) {
      return '<div class="empty-state-mini"><i class="bi bi-file-text"></i><p>No requests yet</p></div>';
    }

    return requests
      .map(
        req => `
            <div class="request-card">
                <div class="request-info">
                    <span class="request-type">${req.type}</span>
                    <span class="request-date">${req.dateSubmitted}</span>
                </div>
                <span class="status-pill status-${req.statusClass}">${req.status}</span>
            </div>
        `
      )
      .join('');
  }

  /**
   * Render modern payments for bento dashboard
   */
  static renderModernPayments(payments) {
    if (!payments.length) {
      return '<div class="empty-state-mini"><i class="bi bi-credit-card"></i><p>No payments yet</p></div>';
    }

    return payments
      .map(
        payment => `
            <div class="payment-card">
                <div class="payment-amount">${payment.formattedAmount}</div>
                <div class="payment-details">
                    <span class="payment-desc">${payment.description}</span>
                    <span class="payment-date">${payment.date}</span>
                </div>
            </div>
        `
      )
      .join('');
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
                        ${requests
                          .map(
                            req => `
                            <tr>
                                <td>${req.type}</td>
                                <td>${req.description}</td>
                                <td>${req.dateSubmitted}</td>
                                <td><span class="badge bg-${req.statusClass}">${req.status}</span></td>
                                <td>${req.dateUpdated || 'N/A'}</td>
                            </tr>
                        `
                          )
                          .join('')}
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

    form.addEventListener('submit', async e => {
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
