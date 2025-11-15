/**
 * Authentication Controller - Mimics ASP.NET Core AccountController
 * Handles login, logout, and authentication-related UI
 */

import authService from '../services/authService.js';
import routingService from '../services/routingService.js';
import notificationService from '../services/notificationService.js';
import ValidationService from '../services/validationService.js';

class AuthController {
    /**
     * Show login page
     * Similar to ASP.NET Core Login GET action
     */
    static async showLogin(params = {}) {
        const pageContent = document.getElementById('page-content');
        
        // Check if already authenticated
        if (authService.checkAuthentication()) {
            routingService.navigate('dashboard');
            return;
        }

        const loginHtml = `
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="card shadow">
                        <div class="card-header text-center bg-primary text-white">
                            <h4 class="mb-0">
                                <i class="bi bi-heart-pulse me-2"></i>
                                Patient Portal
                            </h4>
                        </div>
                        <div class="card-body p-4">
                            <h5 class="card-title text-center mb-4">Welcome Back</h5>
                            
                            <!-- Validation Summary -->
                            <div class="validation-summary"></div>
                            
                            <form id="loginForm" novalidate>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input type="email" class="form-control" id="email" name="email" 
                                           placeholder="Enter your email" required>
                                    <div id="email-error" class="invalid-feedback"></div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="password" name="password" 
                                           placeholder="Enter your password" required>
                                    <div id="password-error" class="invalid-feedback"></div>
                                </div>
                                
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="rememberMe" name="rememberMe">
                                    <label class="form-check-label" for="rememberMe">
                                        Remember me
                                    </label>
                                </div>
                                
                                <button type="submit" class="btn btn-primary w-100 mb-3" id="loginBtn">
                                    <span class="btn-text">Sign In</span>
                                    <span class="btn-spinner d-none">
                                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Signing in...
                                    </span>
                                </button>
                            </form>
                            
                            <div class="text-center">
                                <p class="mb-2">Don't have an account?</p>
                                <a href="#register" class="btn btn-outline-primary">
                                    Create New Account
                                </a>
                            </div>
                            
                            <!-- Demo Credentials Info -->
                            <div class="alert alert-info mt-4">
                                <small>
                                    <strong>Demo:</strong> Use any email and password to sign in.
                                    <br>Example: demo@example.com / password123
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = loginHtml;
        pageContent.classList.add('fade-in');

        // Setup form validation
        this.setupLoginValidation();
        
        // Setup form submission
        this.setupLoginSubmission();
        
        // Focus on email field
        setTimeout(() => {
            document.getElementById('email').focus();
        }, 100);
    }

    /**
     * Setup login form validation
     */
    static setupLoginValidation() {
        const form = document.getElementById('loginForm');
        const validationRules = {
            email: [
                ValidationService.validators.required,
                ValidationService.validators.email
            ],
            password: [
                ValidationService.validators.required,
                ValidationService.validators.minLength(6, 'Password must be at least 6 characters')
            ]
        };

        // Setup real-time validation
        ValidationService.setupRealtimeValidation(form, validationRules);
    }

    /**
     * Setup login form submission
     */
    static setupLoginSubmission() {
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('loginBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');
            const rememberMe = formData.get('rememberMe') === 'on';

            // Validate form
            const validationRules = {
                email: [
                    ValidationService.validators.required,
                    ValidationService.validators.email
                ],
                password: [
                    ValidationService.validators.required,
                    ValidationService.validators.minLength(6)
                ]
            };

            const validationResult = ValidationService.validateForm(
                { email, password }, 
                validationRules
            );

            if (!validationResult.isValid) {
                ValidationService.displayValidationSummary(form, validationResult);
                return;
            }

            // Show loading state
            this.setLoginLoadingState(submitBtn, true);

            try {
                // Attempt login
                const result = await authService.login(email, password);
                
                if (result.success) {
                    notificationService.showSuccess('Login successful! Welcome back.');
                    
                    // Small delay for better UX
                    setTimeout(() => {
                        routingService.navigate('dashboard');
                    }, 500);
                } else {
                    notificationService.showError(result.message);
                    this.setLoginLoadingState(submitBtn, false);
                }
            } catch (error) {
                console.error('Login error:', error);
                notificationService.showError('Login failed. Please try again.');
                this.setLoginLoadingState(submitBtn, false);
            }
        });
    }

    /**
     * Set login button loading state
     */
    static setLoginLoadingState(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const btnSpinner = button.querySelector('.btn-spinner');
        
        if (isLoading) {
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
            button.disabled = true;
        } else {
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
            button.disabled = false;
        }
    }

    /**
     * Logout user
     * Similar to ASP.NET Core Logout action
     */
    static async logout() {
        try {
            const result = authService.logout();
            notificationService.showInfo('You have been logged out successfully.');
            // Routing service will handle redirect to login
        } catch (error) {
            console.error('Logout error:', error);
            notificationService.showError('Logout failed. Please try again.');
        }
    }

    /**
     * Check if user is authenticated
     * Used by routing service for protected routes
     */
    static isAuthenticated() {
        return authService.checkAuthentication();
    }

    /**
     * Get current user information
     */
    static getCurrentUser() {
        return authService.getCurrentUser();
    }

    /**
     * Handle authentication errors
     */
    static handleAuthError(error) {
        console.error('Authentication error:', error);
        notificationService.showError('Session expired. Please log in again.');
        authService.logout();
    }
}

// Make globally available for inline event handlers
window.AuthController = AuthController;

export default AuthController;