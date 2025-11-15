/**
 * Custom Validation Framework - ASP.NET Core ModelState Pattern
 * Enterprise-level client-side validation system
 * 
 * This example shows how to create a validation framework that mirrors
 * ASP.NET Core's ModelState and Data Annotations patterns in JavaScript.
 */

class ValidationFramework {
    /**
     * ValidationResult class - mirrors ASP.NET Core ValidationResult
     */
    static ValidationResult = class {
        constructor(isValid = true, errors = {}) {
            this.isValid = isValid;
            this.errors = errors;
        }

        addError(field, message) {
            this.isValid = false;
            if (!this.errors[field]) {
                this.errors[field] = [];
            }
            this.errors[field].push(message);
        }

        getErrors(field) {
            return this.errors[field] || [];
        }

        getAllErrors() {
            return this.errors;
        }
    };

    /**
     * Validation Attributes - mirrors ASP.NET Core Data Annotations
     */
    static validators = {
        // [Required] attribute equivalent
        required: (value, message = 'This field is required') => {
            return value && value.toString().trim().length > 0 ? null : message;
        },

        // [EmailAddress] attribute equivalent
        email: (value, message = 'Please enter a valid email address') => {
            if (!value) return null;
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            return emailRegex.test(value) ? null : message;
        },

        // [StringLength(min, max)] attribute equivalent
        minLength: (minLength, message) => {
            return (value) => {
                if (!value) return null;
                return value.length >= minLength ? null : 
                    message || `Must be at least ${minLength} characters long`;
            };
        },

        // [Phone] attribute equivalent
        phone: (value, message = 'Please enter a valid phone number') => {
            if (!value) return null;
            const phoneRegex = /^[\\+]?[1-9][\\d]{0,3}[\\s\\-\\.]?[\\(]?[\\d]{3}[\\)]?[\\s\\-\\.]?[\\d]{3}[\\s\\-\\.]?[\\d]{4}$/;
            return phoneRegex.test(value.replace(/[\\s\\-\\.\\(\\)]/g, '')) ? null : message;
        },

        // [Compare] attribute equivalent
        match: (otherField, otherValue, message) => {
            return (value) => {
                return value === otherValue ? null : 
                    message || `Must match ${otherField}`;
            };
        }
    };

    /**
     * Model State Dictionary - mirrors ASP.NET Core ModelStateDictionary
     */
    static validateForm(formData, validationRules) {
        const result = new this.ValidationResult();
        
        Object.keys(validationRules).forEach(fieldName => {
            const value = formData[fieldName];
            const rules = validationRules[fieldName];
            const fieldErrors = this.validateField(value, rules);
            
            fieldErrors.forEach(error => {
                result.addError(fieldName, error);
            });
        });
        
        return result;
    }

    /**
     * Field-level validation
     */
    static validateField(value, rules) {
        const errors = [];
        
        for (const rule of rules) {
            let validator, message;
            
            if (typeof rule === 'string') {
                validator = this.validators[rule];
            } else if (typeof rule === 'function') {
                validator = rule;
            } else if (rule.validator) {
                validator = this.validators[rule.validator] || rule.validator;
                message = rule.message;
            }
            
            if (validator) {
                const error = validator(value, message);
                if (error) {
                    errors.push(error);
                }
            }
        }
        
        return errors;
    }

    /**
     * Real-time validation setup - similar to ASP.NET Core client validation
     */
    static setupRealtimeValidation(formElement, validationRules) {
        Object.keys(validationRules).forEach(fieldName => {
            const input = formElement.querySelector(`[name="${fieldName}"]`);
            if (!input) return;
            
            const errorContainer = formElement.querySelector(`#${fieldName}-error`);
            
            ['blur', 'input'].forEach(event => {
                input.addEventListener(event, () => {
                    const errors = this.validateField(input.value, validationRules[fieldName]);
                    this.displayFieldErrors(input, errorContainer, errors);
                });
            });
        });
    }

    /**
     * Display validation errors with Bootstrap styling
     */
    static displayFieldErrors(inputElement, errorContainer, errors) {
        inputElement.classList.remove('is-invalid', 'is-valid');
        
        if (errors.length > 0) {
            inputElement.classList.add('is-invalid');
            if (errorContainer) {
                errorContainer.textContent = errors[0];
                errorContainer.className = 'invalid-feedback d-block';
            }
        } else {
            if (inputElement.value.trim()) {
                inputElement.classList.add('is-valid');
            }
            if (errorContainer) {
                errorContainer.textContent = '';
                errorContainer.className = 'invalid-feedback';
            }
        }
    }
}

/**
 * USAGE EXAMPLE - Patient Registration Form
 */

// Define validation rules similar to ASP.NET Core model attributes
const patientValidationRules = {
    firstName: [
        ValidationFramework.validators.required
    ],
    email: [
        ValidationFramework.validators.required,
        ValidationFramework.validators.email
    ],
    password: [
        ValidationFramework.validators.required,
        ValidationFramework.validators.minLength(6)
    ],
    phone: [
        ValidationFramework.validators.required,
        ValidationFramework.validators.phone
    ]
};

// Setup form validation
function initializePatientForm() {
    const form = document.getElementById('patientForm');
    
    // Setup real-time validation
    ValidationFramework.setupRealtimeValidation(form, patientValidationRules);
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const patientData = {};
        
        for (const [key, value] of formData.entries()) {
            patientData[key] = value;
        }
        
        // Validate entire form
        const validationResult = ValidationFramework.validateForm(patientData, patientValidationRules);
        
        if (validationResult.isValid) {
            // Process valid form data
            console.log('Form is valid, submitting...', patientData);
            submitPatientData(patientData);
        } else {
            // Display validation errors
            console.log('Validation errors:', validationResult.getAllErrors());
            displayValidationSummary(validationResult);
        }
    });
}

// Display validation summary (similar to ASP.NET Core ValidationSummary helper)
function displayValidationSummary(validationResult) {
    const summaryElement = document.querySelector('.validation-summary');
    if (!summaryElement) return;
    
    const errorList = Object.entries(validationResult.getAllErrors())
        .flatMap(([field, errors]) => errors)
        .map(error => `<li>${error}</li>`)
        .join('');
    
    summaryElement.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h6>Please correct the following errors:</h6>
            <ul class="mb-0">${errorList}</ul>
        </div>
    `;
}

export default ValidationFramework;