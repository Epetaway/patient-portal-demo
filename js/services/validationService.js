/**
 * Validation Service - Mimics ASP.NET Core ModelState and Validation Attributes
 * Provides client-side validation with server-side patterns
 */

class ValidationService {
    /**
     * Validation result class similar to ASP.NET Core ValidationResult
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

        hasErrors() {
            return Object.keys(this.errors).length > 0;
        }

        getErrors(field) {
            return this.errors[field] || [];
        }

        getAllErrors() {
            return this.errors;
        }
    };

    /**
     * Validation attributes similar to ASP.NET Core Data Annotations
     */
    static validators = {
        required: (value, message = 'This field is required') => {
            return value && value.toString().trim().length > 0 ? null : message;
        },

        email: (value, message = 'Please enter a valid email address') => {
            if (!value) return null; // Skip if empty (use required separately)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : message;
        },

        minLength: (minLength, message) => {
            return (value) => {
                if (!value) return null;
                return value.length >= minLength ? null : 
                    message || `Must be at least ${minLength} characters long`;
            };
        },

        maxLength: (maxLength, message) => {
            return (value) => {
                if (!value) return null;
                return value.length <= maxLength ? null : 
                    message || `Must be no more than ${maxLength} characters long`;
            };
        },

        phone: (value, message = 'Please enter a valid phone number') => {
            if (!value) return null;
            const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\.]?[\(]?[\d]{3}[\)]?[\s\-\.]?[\d]{3}[\s\-\.]?[\d]{4}$/;
            return phoneRegex.test(value.replace(/[\s\-\.\(\)]/g, '')) ? null : message;
        },

        date: (value, message = 'Please enter a valid date') => {
            if (!value) return null;
            const date = new Date(value);
            return !isNaN(date.getTime()) ? null : message;
        },

        pastDate: (value, message = 'Date must be in the past') => {
            if (!value) return null;
            const date = new Date(value);
            const today = new Date();
            return date < today ? null : message;
        },

        zipCode: (value, message = 'Please enter a valid ZIP code') => {
            if (!value) return null;
            const zipRegex = /^\d{5}(-\d{4})?$/;
            return zipRegex.test(value) ? null : message;
        },

        match: (otherField, otherValue, message) => {
            return (value) => {
                return value === otherValue ? null : 
                    message || `Must match ${otherField}`;
            };
        }
    };

    /**
     * Validate a single field with multiple validation rules
     */
    static validateField(value, rules) {
        const errors = [];
        
        for (const rule of rules) {
            let validator, message;
            
            if (typeof rule === 'string') {
                // Simple validator name
                validator = this.validators[rule];
            } else if (typeof rule === 'function') {
                // Custom validator function
                validator = rule;
            } else if (rule.validator) {
                // Validator with custom message
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
     * Validate an entire form object
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
     * Real-time validation for form inputs
     */
    static setupRealtimeValidation(formElement, validationRules) {
        Object.keys(validationRules).forEach(fieldName => {
            const input = formElement.querySelector(`[name="${fieldName}"]`);
            if (!input) return;
            
            const errorContainer = formElement.querySelector(`#${fieldName}-error`);
            
            // Validate on blur and input events
            ['blur', 'input'].forEach(event => {
                input.addEventListener(event, () => {
                    const errors = this.validateField(input.value, validationRules[fieldName]);
                    this.displayFieldErrors(input, errorContainer, errors);
                });
            });
        });
    }

    /**
     * Display validation errors for a field
     */
    static displayFieldErrors(inputElement, errorContainer, errors) {
        // Remove existing error styling
        inputElement.classList.remove('is-invalid', 'is-valid');
        
        if (errors.length > 0) {
            // Add error styling
            inputElement.classList.add('is-invalid');
            
            // Display error message
            if (errorContainer) {
                errorContainer.textContent = errors[0]; // Show first error
                errorContainer.className = 'invalid-feedback d-block';
            }
        } else {
            // Add valid styling if field has value
            if (inputElement.value.trim()) {
                inputElement.classList.add('is-valid');
            }
            
            // Clear error message
            if (errorContainer) {
                errorContainer.textContent = '';
                errorContainer.className = 'invalid-feedback';
            }
        }
    }

    /**
     * Clear all validation errors from form
     */
    static clearFormErrors(formElement) {
        // Remove validation classes
        formElement.querySelectorAll('.is-invalid, .is-valid').forEach(element => {
            element.classList.remove('is-invalid', 'is-valid');
        });
        
        // Clear error messages
        formElement.querySelectorAll('.invalid-feedback').forEach(element => {
            element.textContent = '';
        });
    }

    /**
     * Display form-level validation summary
     */
    static displayValidationSummary(formElement, validationResult) {
        const summaryElement = formElement.querySelector('.validation-summary');
        if (!summaryElement) return;
        
        if (validationResult.hasErrors()) {
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
        } else {
            summaryElement.innerHTML = '';
        }
    }
}

export default ValidationService;