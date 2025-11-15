/**
 * Payment Controller - Payment Processing and History
 * Handles payment methods, processing, and transaction history
 */

import authService from '../services/authService.js';
import dataService from '../services/dataService.js';
import notificationService from '../services/notificationService.js';
import ValidationService from '../services/validationService.js';

class PaymentController {
    static async showPayments(params = {}) {
        try {
            const pageContent = document.getElementById('page-content');
            const user = authService.getCurrentUser();
            
            if (!user) {
                notificationService.showError('User session not found');
                return;
            }

            // Load payment data
            const payments = await dataService.getPaymentsByPatientId(user.id);
            const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
            const recentPayments = payments.slice(0, 5);

            const paymentsHtml = `
                <div class="fade-in">
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2>Payment Management</h2>
                            <p class="text-muted">Manage payments and view transaction history</p>
                        </div>
                    </div>
                    
                    <!-- Payment Stats -->
                    <div class="row mb-4">
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">$${totalPaid.toFixed(2)}</h3>
                                    <p class="mb-0">Total Paid</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">${payments.length}</h3>
                                    <p class="mb-0">Total Transactions</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-info text-white">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">$0.00</h3>
                                    <p class="mb-0">Outstanding Balance</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3 mb-3">
                            <div class="card bg-warning text-dark">
                                <div class="card-body text-center">
                                    <h3 class="mb-1">$25.00</h3>
                                    <p class="mb-0">Next Payment Due</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Payment Section -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Make a Payment</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-lg-8">
                                            ${this.renderPaymentForm()}
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="card bg-light">
                                                <div class="card-body">
                                                    <h6>Payment Summary</h6>
                                                    <div class="d-flex justify-content-between mb-2">
                                                        <span>Amount:</span>
                                                        <span id="payment-amount-display">$0.00</span>
                                                    </div>
                                                    <div class="d-flex justify-content-between mb-2">
                                                        <span>Processing Fee:</span>
                                                        <span class="text-success">FREE</span>
                                                    </div>
                                                    <hr>
                                                    <div class="d-flex justify-content-between fw-bold">
                                                        <span>Total:</span>
                                                        <span id="payment-total-display">$0.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment History -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Payment History</h5>
                                </div>
                                <div class="card-body">
                                    ${this.renderPaymentHistory(payments)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Success Modal -->
                <div class="modal fade" id="paymentSuccessModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body text-center p-4">
                                <div class="text-success mb-3">
                                    <i class="bi bi-check-circle-fill fs-1"></i>
                                </div>
                                <h5>Payment Successful!</h5>
                                <p class="text-muted mb-3" id="payment-success-message">Your payment has been processed successfully.</p>
                                <div id="receipt-details" class="bg-light p-3 rounded mb-3"></div>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            pageContent.innerHTML = paymentsHtml;
            
            // Setup payment form functionality
            this.setupPaymentForm();

        } catch (error) {
            console.error('Payments page error:', error);
            notificationService.showError('Failed to load payment data');
        }
    }

    /**
     * Render payment form
     */
    static renderPaymentForm() {
        return `
            <form id="paymentForm" novalidate>
                <div class="mb-3">
                    <label for="paymentAmount" class="form-label">Payment Amount *</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="number" class="form-control" id="paymentAmount" name="paymentAmount" 
                               min="1" step="0.01" placeholder="25.00" required>
                    </div>
                    <div id="paymentAmount-error" class="invalid-feedback"></div>
                </div>
                
                <div class="mb-3">
                    <label for="paymentReason" class="form-label">Payment For</label>
                    <select class="form-control" id="paymentReason" name="paymentReason">
                        <option value="Medication Copay">Medication Copay</option>
                        <option value="Prescription Refill">Prescription Refill</option>
                        <option value="Healthcare Service">Healthcare Service</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <!-- Payment Method Tabs -->
                <div class="mb-3">
                    <label class="form-label">Payment Method *</label>
                    <ul class="nav nav-tabs" id="paymentMethodTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="card-tab" data-bs-toggle="tab" 
                                    data-bs-target="#card-payment" type="button" role="tab">
                                <i class="bi bi-credit-card me-2"></i>Credit Card
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="paypal-tab" data-bs-toggle="tab" 
                                    data-bs-target="#paypal-payment" type="button" role="tab">
                                <i class="bi bi-paypal me-2"></i>PayPal
                            </button>
                        </li>
                    </ul>
                    
                    <div class="tab-content border border-top-0 p-3">
                        <!-- Credit Card Tab -->
                        <div class="tab-pane fade show active" id="card-payment" role="tabpanel">
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label for="cardNumber" class="form-label">Card Number *</label>
                                    <input type="text" class="form-control" id="cardNumber" name="cardNumber" 
                                           placeholder="1234 5678 9012 3456" maxlength="19" required>
                                    <div id="cardNumber-error" class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="cvv" class="form-label">CVV *</label>
                                    <input type="text" class="form-control" id="cvv" name="cvv" 
                                           placeholder="123" maxlength="4" required>
                                    <div id="cvv-error" class="invalid-feedback"></div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label for="cardName" class="form-label">Name on Card *</label>
                                    <input type="text" class="form-control" id="cardName" name="cardName" 
                                           placeholder="John Doe" required>
                                    <div id="cardName-error" class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="expiry" class="form-label">MM/YY *</label>
                                    <input type="text" class="form-control" id="expiry" name="expiry" 
                                           placeholder="12/25" maxlength="5" required>
                                    <div id="expiry-error" class="invalid-feedback"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- PayPal Tab -->
                        <div class="tab-pane fade" id="paypal-payment" role="tabpanel">
                            <div class="text-center py-4">
                                <i class="bi bi-paypal fs-1 text-primary mb-3"></i>
                                <p class="mb-3">You will be redirected to PayPal to complete your payment securely.</p>
                                <small class="text-muted">PayPal account or credit/debit card required</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-100">
                    <i class="bi bi-credit-card me-2"></i>Process Payment
                </button>
            </form>
        `;
    }

    /**
     * Render payment history
     */
    static renderPaymentHistory(payments) {
        if (!payments.length) {
            return `
                <div class="text-center py-5">
                    <i class="bi bi-receipt fs-1 text-muted mb-3"></i>
                    <h5 class="text-muted">No Payment History</h5>
                    <p class="text-muted">Your payment transactions will appear here.</p>
                </div>
            `;
        }

        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payments.map(payment => `
                            <tr>
                                <td>${payment.date}</td>
                                <td>${payment.description}</td>
                                <td class="fw-bold text-success">${payment.formattedAmount}</td>
                                <td>${payment.method}</td>
                                <td><span class="badge bg-success">Completed</span></td>
                                <td><small class="text-muted">${payment.transactionId}</small></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Setup payment form functionality
     */
    static setupPaymentForm() {
        const form = document.getElementById('paymentForm');
        const amountInput = document.getElementById('paymentAmount');
        
        // Update payment summary when amount changes
        amountInput.addEventListener('input', () => {
            const amount = parseFloat(amountInput.value) || 0;
            document.getElementById('payment-amount-display').textContent = `$${amount.toFixed(2)}`;
            document.getElementById('payment-total-display').textContent = `$${amount.toFixed(2)}`;
        });
        
        // Format card number input
        const cardNumberInput = document.getElementById('cardNumber');
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            const formattedInputValue = value.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = formattedInputValue;
        });
        
        // Format expiry input
        const expiryInput = document.getElementById('expiry');
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    /**
     * Process payment
     */
    static async processPayment() {
        try {
            const form = document.getElementById('paymentForm');
            const formData = new FormData(form);
            
            const amount = parseFloat(formData.get('paymentAmount'));
            const reason = formData.get('paymentReason');
            const activeTab = document.querySelector('.tab-pane.active').id;
            
            // Basic validation
            if (!amount || amount < 1) {
                notificationService.showError('Please enter a valid payment amount.');
                return;
            }
            
            const paymentMethod = activeTab === 'card-payment' ? 'Credit Card' : 'PayPal';
            
            // Additional validation for credit card
            if (activeTab === 'card-payment') {
                const cardNumber = formData.get('cardNumber');
                const cardName = formData.get('cardName');
                const expiry = formData.get('expiry');
                const cvv = formData.get('cvv');
                
                if (!cardNumber || !cardName || !expiry || !cvv) {
                    notificationService.showError('Please fill in all credit card fields.');
                    return;
                }
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Payment...';
            submitBtn.disabled = true;
            
            // Show processing notification
            const loadingToast = notificationService.showLoading('Processing your payment...', 'Please wait');
            
            const user = authService.getCurrentUser();
            
            // Process payment
            const result = await dataService.processPayment(
                user.id,
                amount,
                paymentMethod,
                reason
            );
            
            // Dismiss loading notification
            notificationService.dismissToast(loadingToast);
            
            if (result.success) {
                // Show success modal with receipt
                this.showPaymentSuccess(result.payment);
                
                // Clear form
                form.reset();
                document.getElementById('payment-amount-display').textContent = '$0.00';
                document.getElementById('payment-total-display').textContent = '$0.00';
                
                // Refresh page after modal closes
                const modal = document.getElementById('paymentSuccessModal');
                modal.addEventListener('hidden.bs.modal', () => {
                    this.showPayments();
                }, { once: true });
                
            } else {
                notificationService.showError(result.message || 'Payment processing failed.');
            }
            
        } catch (error) {
            console.error('Payment processing error:', error);
            notificationService.showError('Payment failed due to a technical error. Please try again.');
        } finally {
            // Restore button state
            const submitBtn = document.querySelector('#paymentForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="bi bi-credit-card me-2"></i>Process Payment';
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * Show payment success modal
     */
    static showPaymentSuccess(payment) {
        const modal = document.getElementById('paymentSuccessModal');
        const messageElement = document.getElementById('payment-success-message');
        const receiptElement = document.getElementById('receipt-details');
        
        messageElement.textContent = `Your payment of ${payment.formattedAmount} has been processed successfully.`;
        
        receiptElement.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <strong>Amount:</strong>
                <span>${payment.formattedAmount}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <strong>Method:</strong>
                <span>${payment.method}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <strong>Transaction ID:</strong>
                <span>${payment.transactionId}</span>
            </div>
            <div class="d-flex justify-content-between">
                <strong>Date:</strong>
                <span>${payment.date}</span>
            </div>
        `;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Make globally available
window.PaymentController = PaymentController;

export default PaymentController;