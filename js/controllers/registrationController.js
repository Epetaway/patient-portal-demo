/**
 * Registration Controller - Multi-step Registration Wizard
 * Handles patient registration with 4-step workflow
 */

import { RegistrationForm } from '../models/models.js';
import dataService from '../services/dataService.js';
import authService from '../services/authService.js';
import routingService from '../services/routingService.js';
import notificationService from '../services/notificationService.js';
import ValidationService from '../services/validationService.js';

class RegistrationController {
    static registrationForm = new RegistrationForm();
    static currentStep = 1;
    static totalSteps = 4;
    
    static async showRegistration(params = {}) {
        // Check if already authenticated
        if (authService.checkAuthentication()) {
            routingService.navigate('dashboard');
            return;
        }

        // Load saved progress if any
        this.loadSavedProgress();
        
        // Get step from params or use current
        const step = parseInt(params.step) || this.currentStep;
        this.currentStep = Math.max(1, Math.min(step, this.totalSteps));
        
        const pageContent = document.getElementById('page-content');
        
        const registrationHtml = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow">
                        <div class="card-header bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <h4 class="mb-0">
                                    <i class="bi bi-person-plus me-2"></i>
                                    Patient Registration
                                </h4>
                                <small>Step ${this.currentStep} of ${this.totalSteps}</small>
                            </div>
                            <!-- Progress Bar -->
                            <div class="progress mt-3" style="height: 6px;">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: ${(this.currentStep / this.totalSteps) * 100}%"
                                     aria-valuenow="${this.currentStep}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="${this.totalSteps}"></div>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <!-- Step Content -->
                            <div id="step-content">
                                ${this.renderStep(this.currentStep)}
                            </div>
                            
                            <!-- Navigation -->
                            <div class="d-flex justify-content-between mt-4">
                                <div>
                                    ${this.currentStep > 1 ? 
                                        '<button type="button" class="btn btn-outline-secondary" onclick="RegistrationController.previousStep()"><i class="bi bi-arrow-left me-2"></i>Previous</button>' : 
                                        '<a href="#login" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-2"></i>Back to Login</a>'
                                    }
                                </div>
                                <div>
                                    ${this.currentStep < this.totalSteps ? 
                                        '<button type="button" class="btn btn-primary" onclick="RegistrationController.nextStep()">Next <i class="bi bi-arrow-right ms-2"></i></button>' :
                                        '<button type="button" class="btn btn-success" onclick="RegistrationController.submitRegistration()"><i class="bi bi-check-circle me-2"></i>Complete Registration</button>'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        pageContent.innerHTML = registrationHtml;
        pageContent.classList.add('fade-in');
        
        // Setup step-specific functionality
        this.setupStepFunctionality();
    }
    
    /**
     * Render content for specific step
     */
    static renderStep(step) {
        switch (step) {
            case 1:
                return this.renderAccountStep();
            case 2:
                return this.renderPatientDetailsStep();
            case 3:
                return this.renderProgramStep();
            case 4:
                return this.renderConsentReviewStep();
            default:
                return '<p>Invalid step</p>';
        }
    }
    
    /**
     * Step 1: Account Information
     */
    static renderAccountStep() {
        const data = this.registrationForm.account;
        return `
            <h5 class="mb-4">Account Information</h5>
            <div class="validation-summary"></div>
            
            <form id="accountForm" novalidate>
                <div class="mb-3">
                    <label for="email" class="form-label">Email Address *</label>
                    <input type="email" class="form-control" id="email" name="email" 
                           value="${data.email}" placeholder="Enter your email address" required>
                    <div id="email-error" class="invalid-feedback"></div>
                </div>
                
                <div class="mb-3">
                    <label for="password" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="password" name="password" 
                           value="${data.password}" placeholder="Create a strong password" required>
                    <div id="password-error" class="invalid-feedback"></div>
                    <div class="form-text">Password must be at least 6 characters long</div>
                </div>
                
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" 
                           value="${data.confirmPassword}" placeholder="Confirm your password" required>
                    <div id="confirmPassword-error" class="invalid-feedback"></div>
                </div>
            </form>
        `;
    }
    
    /**
     * Step 2: Patient Details
     */
    static renderPatientDetailsStep() {
        const data = this.registrationForm.patient;
        return `
            <h5 class="mb-4">Patient Information</h5>
            <div class="validation-summary"></div>
            
            <form id="patientForm" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="firstName" class="form-label">First Name *</label>
                        <input type="text" class="form-control" id="firstName" name="firstName" 
                               value="${data.firstName}" placeholder="Your first name" required>
                        <div id="firstName-error" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="lastName" class="form-label">Last Name *</label>
                        <input type="text" class="form-control" id="lastName" name="lastName" 
                               value="${data.lastName}" placeholder="Your last name" required>
                        <div id="lastName-error" class="invalid-feedback"></div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="dateOfBirth" class="form-label">Date of Birth *</label>
                        <input type="date" class="form-control" id="dateOfBirth" name="dateOfBirth" 
                               value="${data.dateOfBirth}" required>
                        <div id="dateOfBirth-error" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Phone Number *</label>
                        <input type="tel" class="form-control" id="phone" name="phone" 
                               value="${data.phone}" placeholder="(555) 123-4567" required>
                        <div id="phone-error" class="invalid-feedback"></div>
                    </div>
                </div>
                
                <hr class="my-4">
                <h6 class="mb-3">Address Information</h6>
                
                <div class="mb-3">
                    <label for="street" class="form-label">Street Address *</label>
                    <input type="text" class="form-control" id="street" name="street" 
                           value="${data.address.street}" placeholder="123 Main Street" required>
                    <div id="street-error" class="invalid-feedback"></div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">City *</label>
                        <input type="text" class="form-control" id="city" name="city" 
                               value="${data.address.city}" placeholder="Your city" required>
                        <div id="city-error" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="state" class="form-label">State *</label>
                        <select class="form-control" id="state" name="state" required>
                            <option value="">Select State</option>
                            <option value="AL" ${data.address.state === 'AL' ? 'selected' : ''}>Alabama</option>
                            <option value="CA" ${data.address.state === 'CA' ? 'selected' : ''}>California</option>
                            <option value="FL" ${data.address.state === 'FL' ? 'selected' : ''}>Florida</option>
                            <option value="IL" ${data.address.state === 'IL' ? 'selected' : ''}>Illinois</option>
                            <option value="NY" ${data.address.state === 'NY' ? 'selected' : ''}>New York</option>
                            <option value="TX" ${data.address.state === 'TX' ? 'selected' : ''}>Texas</option>
                        </select>
                        <div id="state-error" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="zipCode" class="form-label">ZIP Code *</label>
                        <input type="text" class="form-control" id="zipCode" name="zipCode" 
                               value="${data.address.zipCode}" placeholder="12345" required>
                        <div id="zipCode-error" class="invalid-feedback"></div>
                    </div>
                </div>
            </form>
        `;
    }
    
    /**
     * Step 3: Program & Insurance
     */
    static renderProgramStep() {
        const data = this.registrationForm.program;
        return `
            <h5 class="mb-4">Program & Insurance Information</h5>
            <div class="validation-summary"></div>
            
            <form id="programForm" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="medication" class="form-label">Primary Medication *</label>
                        <select class="form-control" id="medication" name="medication" required>
                            <option value="">Select medication...</option>
                            <option value="Medication Alpha" ${data.medication === 'Medication Alpha' ? 'selected' : ''}>Medication Alpha</option>
                            <option value="Medication Beta" ${data.medication === 'Medication Beta' ? 'selected' : ''}>Medication Beta</option>
                            <option value="Medication Gamma" ${data.medication === 'Medication Gamma' ? 'selected' : ''}>Medication Gamma</option>
                        </select>
                        <div id="medication-error" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="program" class="form-label">Assistance Program *</label>
                        <select class="form-control" id="program" name="program" required>
                            <option value="">Select program...</option>
                            <option value="Program A" ${data.program === 'Program A' ? 'selected' : ''}>Program A - Comprehensive Care</option>
                            <option value="Program B" ${data.program === 'Program B' ? 'selected' : ''}>Program B - Medication Assistance</option>
                        </select>
                        <div id="program-error" class="invalid-feedback"></div>
                    </div>
                </div>
                
                <hr class="my-4">
                <h6 class="mb-3">Insurance Information</h6>
                
                <div class="mb-3">
                    <label for="insuranceProvider" class="form-label">Insurance Provider *</label>
                    <input type="text" class="form-control" id="insuranceProvider" name="insuranceProvider" 
                           value="${data.insurance.provider}" placeholder="Blue Cross Blue Shield" required>
                    <div id="insuranceProvider-error" class="invalid-feedback"></div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="memberId" class="form-label">Member ID *</label>
                        <input type="text" class="form-control" id="memberId" name="memberId" 
                               value="${data.insurance.memberId}" placeholder="ABC123456789" required>
                        <div id="memberId-error" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="groupNumber" class="form-label">Group Number</label>
                        <input type="text" class="form-control" id="groupNumber" name="groupNumber" 
                               value="${data.insurance.groupNumber}" placeholder="GRP001">
                        <div id="groupNumber-error" class="invalid-feedback"></div>
                    </div>
                </div>
            </form>
        `;
    }
    
    /**
     * Step 4: Consent & Review
     */
    static renderConsentReviewStep() {
        const data = this.registrationForm.consent;
        return `
            <h5 class="mb-4">Consent & Review</h5>
            <div class="validation-summary"></div>
            
            <!-- Registration Summary -->
            <div class="card bg-light mb-4">
                <div class="card-header">
                    <h6 class="mb-0">Registration Summary</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Account:</strong><br>
                            ${this.registrationForm.account.email}<br><br>
                            <strong>Patient:</strong><br>
                            ${this.registrationForm.patient.firstName} ${this.registrationForm.patient.lastName}<br>
                            DOB: ${this.registrationForm.patient.dateOfBirth}<br>
                            Phone: ${this.registrationForm.patient.phone}
                        </div>
                        <div class="col-md-6">
                            <strong>Address:</strong><br>
                            ${this.registrationForm.patient.address.street}<br>
                            ${this.registrationForm.patient.address.city}, ${this.registrationForm.patient.address.state} ${this.registrationForm.patient.address.zipCode}<br><br>
                            <strong>Program:</strong><br>
                            ${this.registrationForm.program.medication}<br>
                            ${this.registrationForm.program.program}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Consent Form -->
            <form id="consentForm" novalidate>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="privacyPolicy" name="privacyPolicy" 
                           ${data.privacyPolicy ? 'checked' : ''} required>
                    <label class="form-check-label" for="privacyPolicy">
                        I agree to the <a href="#" target="_blank">Privacy Policy</a> and <a href="#" target="_blank">Terms of Service</a> *
                    </label>
                    <div id="privacyPolicy-error" class="invalid-feedback"></div>
                </div>
                
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="emailCommunication" name="emailCommunication" 
                           ${data.emailCommunication ? 'checked' : ''}>
                    <label class="form-check-label" for="emailCommunication">
                        I consent to receive email communications about my healthcare
                    </label>
                </div>
                
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="smsCommunication" name="smsCommunication" 
                           ${data.smsCommunication ? 'checked' : ''}>
                    <label class="form-check-label" for="smsCommunication">
                        I consent to receive SMS/text message communications
                    </label>
                </div>
                
                <div class="alert alert-info">
                    <small>
                        <i class="bi bi-info-circle me-2"></i>
                        By completing registration, you will gain access to prescription management, refill requests, 
                        payment processing, and information request services.
                    </small>
                </div>
            </form>
        `;
    }
    
    /**
     * Setup functionality for current step
     */
    static setupStepFunctionality() {
        // Setup validation for current step
        this.setupStepValidation();
        
        // Auto-save form data on input
        this.setupAutoSave();
        
        // Focus first input
        setTimeout(() => {
            const firstInput = document.querySelector('#step-content input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    /**
     * Setup validation for current step
     */
    static setupStepValidation() {
        const forms = document.querySelectorAll('#step-content form');
        
        forms.forEach(form => {
            const validationRules = this.getValidationRulesForStep(this.currentStep);
            if (validationRules) {
                ValidationService.setupRealtimeValidation(form, validationRules);
            }
        });
    }
    
    /**
     * Get validation rules for specific step
     */
    static getValidationRulesForStep(step) {
        switch (step) {
            case 1: // Account
                return {
                    email: [
                        ValidationService.validators.required,
                        ValidationService.validators.email
                    ],
                    password: [
                        ValidationService.validators.required,
                        ValidationService.validators.minLength(6)
                    ],
                    confirmPassword: [
                        ValidationService.validators.required
                    ]
                };
            
            case 2: // Patient Details
                return {
                    firstName: [ValidationService.validators.required],
                    lastName: [ValidationService.validators.required],
                    dateOfBirth: [
                        ValidationService.validators.required,
                        ValidationService.validators.date
                    ],
                    phone: [ValidationService.validators.required],
                    street: [ValidationService.validators.required],
                    city: [ValidationService.validators.required],
                    state: [ValidationService.validators.required],
                    zipCode: [ValidationService.validators.required]
                };
            
            case 3: // Program
                return {
                    medication: [ValidationService.validators.required],
                    program: [ValidationService.validators.required],
                    insuranceProvider: [ValidationService.validators.required],
                    memberId: [ValidationService.validators.required]
                };
            
            case 4: // Consent
                return {
                    privacyPolicy: [ValidationService.validators.required]
                };
            
            default:
                return null;
        }
    }
    
    /**
     * Setup auto-save functionality
     */
    static setupAutoSave() {
        const inputs = document.querySelectorAll('#step-content input, #step-content select, #step-content textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveCurrentStepData();
            });
            
            input.addEventListener('change', () => {
                this.saveCurrentStepData();
            });
        });
    }
    
    /**
     * Save current step data to form model
     */
    static saveCurrentStepData() {
        const form = document.querySelector('#step-content form');
        if (!form) return;
        
        const formData = new FormData(form);
        
        switch (this.currentStep) {
            case 1: // Account
                this.registrationForm.account = {
                    email: formData.get('email') || '',
                    password: formData.get('password') || '',
                    confirmPassword: formData.get('confirmPassword') || ''
                };
                break;
                
            case 2: // Patient Details
                this.registrationForm.patient = {
                    firstName: formData.get('firstName') || '',
                    lastName: formData.get('lastName') || '',
                    dateOfBirth: formData.get('dateOfBirth') || '',
                    phone: formData.get('phone') || '',
                    address: {
                        street: formData.get('street') || '',
                        city: formData.get('city') || '',
                        state: formData.get('state') || '',
                        zipCode: formData.get('zipCode') || ''
                    }
                };
                break;
                
            case 3: // Program
                this.registrationForm.program = {
                    medication: formData.get('medication') || '',
                    program: formData.get('program') || '',
                    insurance: {
                        provider: formData.get('insuranceProvider') || '',
                        memberId: formData.get('memberId') || '',
                        groupNumber: formData.get('groupNumber') || ''
                    }
                };
                break;
                
            case 4: // Consent
                this.registrationForm.consent = {
                    privacyPolicy: formData.get('privacyPolicy') === 'on',
                    emailCommunication: formData.get('emailCommunication') === 'on',
                    smsCommunication: formData.get('smsCommunication') === 'on'
                };
                break;
        }
        
        // Save to localStorage
        this.saveProgress();
    }
    
    /**
     * Validate current step
     */
    static validateCurrentStep() {
        const form = document.querySelector('#step-content form');
        if (!form) return { isValid: true };
        
        // Get current step data
        const formData = new FormData(form);
        const stepData = {};
        
        for (const [key, value] of formData.entries()) {
            stepData[key] = value;
        }
        
        // Special validation for password confirmation
        if (this.currentStep === 1) {
            const password = stepData.password;
            const confirmPassword = stepData.confirmPassword;
            
            if (password !== confirmPassword) {
                const confirmInput = document.getElementById('confirmPassword');
                if (confirmInput) {
                    confirmInput.classList.add('is-invalid');
                    const errorDiv = document.getElementById('confirmPassword-error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Passwords must match';
                        errorDiv.className = 'invalid-feedback d-block';
                    }
                }
                return { isValid: false };
            }
        }
        
        // Get validation rules and validate
        const validationRules = this.getValidationRulesForStep(this.currentStep);
        if (!validationRules) return { isValid: true };
        
        const result = ValidationService.validateForm(stepData, validationRules);
        
        // Display validation summary if errors
        if (!result.isValid) {
            ValidationService.displayValidationSummary(form, result);
        }
        
        return result;
    }
    
    /**
     * Navigate to next step
     */
    static async nextStep() {
        // Save current step data
        this.saveCurrentStepData();
        
        // Validate current step
        const validation = this.validateCurrentStep();
        if (!validation.isValid) {
            notificationService.showError('Please correct the errors below before continuing.');
            return;
        }
        
        // Move to next step
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            await this.showRegistration({ step: this.currentStep });
        }
    }
    
    /**
     * Navigate to previous step
     */
    static async previousStep() {
        // Save current step data (no validation required)
        this.saveCurrentStepData();
        
        // Move to previous step
        if (this.currentStep > 1) {
            this.currentStep--;
            await this.showRegistration({ step: this.currentStep });
        }
    }
    
    /**
     * Submit complete registration
     */
    static async submitRegistration() {
        try {
            // Save current step data
            this.saveCurrentStepData();
            
            // Validate final step
            const validation = this.validateCurrentStep();
            if (!validation.isValid) {
                notificationService.showError('Please correct the errors below before submitting.');
                return;
            }
            
            // Validate required consent
            if (!this.registrationForm.consent.privacyPolicy) {
                notificationService.showError('You must agree to the Privacy Policy to complete registration.');
                return;
            }
            
            // Show loading state
            const submitBtn = document.querySelector('button[onclick="RegistrationController.submitRegistration()"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Completing Registration...';
            submitBtn.disabled = true;
            
            // Submit registration
            const result = await dataService.registerPatient(this.registrationForm);
            
            if (result.success) {
                notificationService.showSuccess('Registration completed successfully! Welcome to the patient portal.');
                
                // Clear saved progress
                this.clearProgress();
                
                // Auto-login the new user
                const loginResult = await authService.login(
                    this.registrationForm.account.email, 
                    this.registrationForm.account.password
                );
                
                if (loginResult.success) {
                    // Small delay then redirect
                    setTimeout(() => {
                        routingService.navigate('dashboard');
                    }, 1500);
                } else {
                    // Registration succeeded but auto-login failed
                    notificationService.showInfo('Registration complete! Please log in with your new credentials.');
                    setTimeout(() => {
                        routingService.navigate('login');
                    }, 2000);
                }
            } else {
                notificationService.showError(result.message || 'Registration failed. Please try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            notificationService.showError('Registration failed due to a technical error. Please try again.');
            
            // Restore button state
            const submitBtn = document.querySelector('button[onclick="RegistrationController.submitRegistration()"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Complete Registration';
                submitBtn.disabled = false;
            }
        }
    }
    
    /**
     * Save progress to localStorage
     */
    static saveProgress() {
        try {
            const progressData = {
                step: this.currentStep,
                form: this.registrationForm,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('patientPortal_registrationProgress', JSON.stringify(progressData));
        } catch (error) {
            console.error('Failed to save registration progress:', error);
        }
    }
    
    /**
     * Load saved progress from localStorage
     */
    static loadSavedProgress() {
        try {
            const progressData = localStorage.getItem('patientPortal_registrationProgress');
            if (progressData) {
                const parsed = JSON.parse(progressData);
                
                // Check if progress is recent (within 24 hours)
                const timestamp = new Date(parsed.timestamp);
                const now = new Date();
                const hours = (now - timestamp) / (1000 * 60 * 60);
                
                if (hours < 24) {
                    this.currentStep = parsed.step || 1;
                    this.registrationForm = parsed.form || new RegistrationForm();
                    
                    console.log('Registration progress restored');
                    return true;
                }
            }
        } catch (error) {
            console.error('Failed to load registration progress:', error);
        }
        
        // Reset to defaults if no valid progress
        this.currentStep = 1;
        this.registrationForm = new RegistrationForm();
        return false;
    }
    
    /**
     * Clear saved progress
     */
    static clearProgress() {
        try {
            localStorage.removeItem('patientPortal_registrationProgress');
            this.currentStep = 1;
            this.registrationForm = new RegistrationForm();
        } catch (error) {
            console.error('Failed to clear registration progress:', error);
        }
    }
}

// Make globally available for inline event handlers
window.RegistrationController = RegistrationController;

export default RegistrationController;