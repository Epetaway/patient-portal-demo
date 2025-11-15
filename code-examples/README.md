# Patient Portal Demo - Code Examples

This directory contains downloadable code examples showcasing specific enterprise frontend development patterns used in the Patient Portal demo.

## Available Examples

### 1. Custom Validation Framework (`validation-framework.js`)
ASP.NET Core ModelState-inspired validation system for client-side forms.

**Features:**
- ValidationResult class with error tracking
- Custom validation attributes (Required, Email, Phone, etc.)
- Real-time form validation setup
- Bootstrap integration for error display

**Usage Example:**
```javascript
// Define validation rules
const rules = {
    email: [
        ValidationService.validators.required,
        ValidationService.validators.email
    ],
    password: [
        ValidationService.validators.required,
        ValidationService.validators.minLength(6)
    ]
};

// Validate form
const result = ValidationService.validateForm(formData, rules);
if (!result.isValid) {
    // Handle errors
}
```

### 2. Multi-Step Form State Management (`form-state-manager.js`)
LocalStorage-based form persistence system for complex multi-step workflows.

**Features:**
- Automatic form state saving
- Progress restoration after page reload
- Session expiration handling
- Step-by-step data validation

### 3. SPA Routing System (`spa-router.js`)
History API-based routing with authentication guards and parameter handling.

**Features:**
- Protected route authentication
- Dynamic meta tag management
- Hash fallback for GitHub Pages
- Route parameter extraction

### 4. Authentication Service (`auth-service.js`)
Session-based authentication system mimicking ASP.NET Core Identity patterns.

**Features:**
- Session management with localStorage
- Authentication state persistence
- Route protection middleware
- Auto-logout on session expiry

### 5. Toast Notification System (`notification-system.js`)
Bootstrap toast-based notification system for user feedback.

**Features:**
- Multiple notification types (success, error, warning, info)
- Auto-dismissal with configurable timing
- Queue management for multiple messages
- Accessibility compliance

## Implementation Notes

These examples demonstrate how to translate enterprise ASP.NET Core patterns to client-side JavaScript while maintaining:

- **Separation of Concerns**: Clear MVC architecture
- **Type Safety**: ES6 classes and consistent interfaces
- **Error Handling**: Comprehensive validation and user feedback
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Efficient DOM manipulation and memory management

## Integration

Each example is designed to work independently but can be combined for comprehensive frontend architecture. The Patient Portal demo shows these patterns working together in a real healthcare application context.

---

*These examples are extracted from a working patient portal application and demonstrate enterprise-level frontend development practices.*