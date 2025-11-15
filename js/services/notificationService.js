/**
 * Notification Service - Bootstrap Toast Management
 * Provides user feedback similar to ASP.NET Core TempData messages
 */

class NotificationService {
    constructor() {
        this.toastContainer = null;
        this.toastCounter = 0;
        this.defaultDelay = 5000;
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Initialize notification service
     */
    initialize() {
        this.toastContainer = document.getElementById('toast-container');
        if (!this.toastContainer) {
            console.warn('Toast container not found');
        }
    }

    /**
     * Show success notification
     * Similar to ASP.NET Core TempData success messages
     */
    showSuccess(message, title = 'Success', options = {}) {
        this.showToast({
            type: 'success',
            title,
            message,
            icon: 'bi-check-circle-fill',
            ...options
        });
    }

    /**
     * Show error notification
     * Similar to ASP.NET Core ModelState error messages
     */
    showError(message, title = 'Error', options = {}) {
        this.showToast({
            type: 'danger',
            title,
            message,
            icon: 'bi-exclamation-triangle-fill',
            delay: 8000, // Longer delay for errors
            ...options
        });
    }

    /**
     * Show warning notification
     */
    showWarning(message, title = 'Warning', options = {}) {
        this.showToast({
            type: 'warning',
            title,
            message,
            icon: 'bi-exclamation-circle-fill',
            textColor: 'dark',
            ...options
        });
    }

    /**
     * Show info notification
     */
    showInfo(message, title = 'Information', options = {}) {
        this.showToast({
            type: 'info',
            title,
            message,
            icon: 'bi-info-circle-fill',
            ...options
        });
    }

    /**
     * Show loading notification
     * Returns toast ID for manual dismissal
     */
    showLoading(message = 'Processing...', title = 'Please wait') {
        const toastId = this.showToast({
            type: 'primary',
            title,
            message,
            icon: 'bi-hourglass-split',
            autohide: false,
            showSpinner: true
        });
        return toastId;
    }

    /**
     * Dismiss a specific toast
     */
    dismissToast(toastId) {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
            toast.hide();
        }
    }

    /**
     * Dismiss all toasts
     */
    dismissAll() {
        const toasts = document.querySelectorAll('.toast.show');
        toasts.forEach(toastElement => {
            const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
            toast.hide();
        });
    }

    /**
     * Show custom toast notification
     */
    showToast(options) {
        if (!this.toastContainer) {
            console.error('Toast container not available');
            return null;
        }

        const {
            type = 'primary',
            title,
            message,
            icon,
            delay = this.defaultDelay,
            autohide = true,
            showSpinner = false,
            textColor = 'white'
        } = options;

        const toastId = `toast-${++this.toastCounter}`;
        
        // Create toast HTML
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-${textColor} bg-${type} border-0" 
                 role="alert" aria-live="assertive" aria-atomic="true" 
                 data-bs-delay="${delay}" data-bs-autohide="${autohide}">
                <div class="d-flex">
                    <div class="toast-body">
                        <div class="d-flex align-items-center">
                            ${icon ? `<i class="bi ${icon} me-2"></i>` : ''}
                            ${showSpinner ? '<div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>' : ''}
                            <div>
                                ${title ? `<div class="fw-bold">${title}</div>` : ''}
                                <div>${message}</div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-${textColor} me-2 m-auto" 
                            data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        // Add toast to container
        this.toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        // Initialize Bootstrap toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        
        // Auto-remove from DOM after hiding
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
        
        // Show toast with animation
        requestAnimationFrame(() => {
            toastElement.classList.add('fade-in');
            toast.show();
        });

        return toastId;
    }

    /**
     * Show form validation errors
     * Similar to ASP.NET Core ValidationSummary
     */
    showValidationErrors(errors) {
        if (typeof errors === 'object') {
            const errorMessages = Object.entries(errors)
                .flatMap(([field, messages]) => 
                    Array.isArray(messages) ? messages : [messages]
                )
                .join('<br>');
            
            this.showError(errorMessages, 'Validation Errors', {
                delay: 10000 // Longer delay for validation errors
            });
        } else {
            this.showError(errors, 'Validation Error');
        }
    }

    /**
     * Show operation result
     * Handles common service response patterns
     */
    showResult(result) {
        if (result.success) {
            this.showSuccess(result.message || 'Operation completed successfully');
        } else {
            this.showError(result.message || 'Operation failed');
        }
    }

    /**
     * Show confirmation dialog using toast
     * Returns promise that resolves with user choice
     */
    showConfirmation(message, title = 'Confirm Action') {
        return new Promise((resolve) => {
            const toastId = `confirm-${++this.toastCounter}`;
            
            const toastHtml = `
                <div id="${toastId}" class="toast align-items-center text-dark bg-light border border-warning" 
                     role="alert" aria-live="assertive" aria-atomic="true" 
                     data-bs-autohide="false">
                    <div class="toast-body">
                        <div class="d-flex align-items-center mb-3">
                            <i class="bi bi-question-circle-fill text-warning me-2"></i>
                            <div>
                                <div class="fw-bold">${title}</div>
                                <div>${message}</div>
                            </div>
                        </div>
                        <div class="d-flex gap-2 justify-content-end">
                            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="cancel">
                                Cancel
                            </button>
                            <button type="button" class="btn btn-sm btn-primary" data-action="confirm">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.toastContainer.insertAdjacentHTML('beforeend', toastHtml);
            
            const toastElement = document.getElementById(toastId);
            const toast = new bootstrap.Toast(toastElement);
            
            // Handle button clicks
            toastElement.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action) {
                    toast.hide();
                    resolve(action === 'confirm');
                }
            });
            
            // Auto-remove from DOM after hiding
            toastElement.addEventListener('hidden.bs.toast', () => {
                toastElement.remove();
            });
            
            toast.show();
        });
    }
}

// Export singleton instance
export default new NotificationService();