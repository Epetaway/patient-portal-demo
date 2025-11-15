# Patient Engagement Portal - Demo

A comprehensive healthcare patient portal demonstration showcasing enterprise-level frontend development patterns inspired by ASP.NET Core MVC architecture. This single-page application demonstrates advanced form handling, authentication workflows, payment integration, and responsive design principles used in real-world healthcare applications.

## 🚀 Live Demo

**[View Live Demo](https://epetaway.github.io/patient-portal-demo/)**

## 🏥 Project Overview

This project demonstrates expertise in building complex healthcare user interfaces with:

- **Multi-step Registration Workflows** with form validation and state persistence
- **Patient Dashboard** with prescription management and refill requests
- **Payment Integration UI** supporting multiple payment vendors
- **Information Request System** with status tracking
- **Profile & Consent Management** with accessibility features
- **Responsive Design** optimized for desktop, tablet, and mobile

## 🛠 Technology Stack

- **Frontend Framework**: Vanilla JavaScript with ES6+ modules
- **UI Framework**: Bootstrap 5.3.2 with custom healthcare theming
- **Architecture Pattern**: ASP.NET Core MVC-inspired (Controllers/Services/Models)
- **State Management**: localStorage with session-based authentication
- **Validation**: Custom framework mimicking ASP.NET Core ModelState
- **Routing**: History API with hash fallback for GitHub Pages
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels
- **Analytics**: Google Analytics integration for portfolio tracking

## 🏗 Architecture

### Folder Structure
```
patient-portal-demo/
├── js/
│   ├── controllers/     # Page controllers (Login, Dashboard, Registration)
│   ├── services/        # Business logic (Auth, Data, Validation, Routing)
│   ├── models/          # Data models and DTOs
│   └── app.js          # Application bootstrap
├── css/
│   └── theme.css       # Custom healthcare theme
├── data.json           # Mock patient data
└── index.html          # SPA shell
```

### Design Patterns Demonstrated

- **MVC Architecture**: Clear separation of concerns with Controllers, Services, and Models
- **Service Layer**: Abstracted data access and business logic
- **Repository Pattern**: Centralized data management with mock API simulation
- **Validation Framework**: Custom validation attributes and error handling
- **Observer Pattern**: Event-driven state management and notifications
- **Factory Pattern**: Dynamic form and component generation

## 💼 Enterprise Features Showcased

### 1. Advanced Form Handling
- Multi-step wizard with progress tracking
- Real-time client-side validation
- Form state persistence across navigation
- Accessibility-compliant form controls

### 2. Authentication & Security
- Session-based authentication simulation
- Protected route navigation
- CSRF-like token handling patterns
- Secure payment form isolation

### 3. Payment Integration
- Multiple payment vendor UI patterns
- Tokenized payment simulation
- Receipt generation and history
- PCI compliance considerations in UI design

### 4. User Experience Excellence
- Progressive enhancement principles
- Mobile-first responsive design
- Loading states and error handling
- Toast notification system

### 5. Accessibility & Compliance
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast mode support

## 🚀 Getting Started

### Prerequisites
- Modern web browser (ES6+ support)
- Local web server (optional for development)

### Installation
```bash
# Clone the repository
git clone https://github.com/epetaway/patient-portal-demo.git

# Navigate to project directory
cd patient-portal-demo

# Install development dependencies (optional)
npm install

# Serve locally
npm run serve
# or
python3 -m http.server 8000
```

### Development
```bash
# Run linting
npm run lint

# Format code
npm run format

# Deploy to GitHub Pages
npm run deploy
```

## 📱 Demo Features

### Login & Registration
- **Demo Credentials**: Any email/password combination
- **Registration Flow**: 4-step wizard with validation
- **Data Persistence**: Form progress saved locally

### Dashboard Navigation
- **Prescriptions**: View medications, request refills
- **Payments**: Multiple vendor integration demos
- **Information Requests**: Submit and track requests
- **Profile Management**: Edit patient information
- **Consent Settings**: Privacy preference management

### Demo Data
All data is mock and HIPAA-compliant with no real patient information.

## 💡 Development Highlights

### Custom Validation Framework
```javascript
// Mimics ASP.NET Core ModelState pattern
class ValidationService {
    static validate(model, rules) {
        const errors = {};
        // Custom validation logic
        return { isValid, errors };
    }
}
```

### Routing System
```javascript
// ASP.NET Core-inspired routing
class Router {
    static route(path, controller, action) {
        // Dynamic route handling with parameter extraction
    }
}
```

### State Management
```javascript
// Session-based state management
class StateManager {
    static setState(key, value) {
        // localStorage with session timeout
    }
}
```

## 🎯 Professional Skills Demonstrated

- **Enterprise Architecture**: Scalable, maintainable code organization
- **Healthcare Domain**: Understanding of patient portal requirements
- **Accessibility**: WCAG compliance and inclusive design
- **Performance**: Optimized loading and responsive interactions
- **Security**: Frontend security best practices
- **Testing**: ESLint integration and code quality standards

## 📊 Analytics & Performance

This demo includes:
- Google Analytics for engagement tracking
- Performance monitoring patterns
- Error logging and user behavior analysis
- Mobile usage optimization

## 🤝 Professional Context

This project demonstrates real-world experience with:
- **Healthcare Software Development**: Patient portal domain expertise
- **Enterprise Frontend Development**: Complex form workflows and validation
- **ASP.NET Core Patterns**: Translating server-side patterns to client-side
- **Accessibility Standards**: Healthcare compliance requirements
- **Multi-tenant Architecture**: Configurable theming and branding

## 📧 Contact

**Earl Hickson**  
Frontend Developer specializing in Healthcare Applications

---

*This portfolio project demonstrates enterprise-level frontend development skills gained through real-world healthcare application development. All patient data is simulated and HIPAA-compliant.*