# Patient Engagement Portal - Demo

A comprehensive healthcare patient portal demonstration showcasing enterprise-level frontend development patterns inspired by ASP.NET Core MVC architecture. This single-page application demonstrates advanced form handling, authentication workflows, payment integration, and responsive design principles used in real-world healthcare applications.

## 🚀 Live Demo

**[View Live Demo](https://epetaway.github.io/patient-portal-demo/)**

### Demo Credentials
- **Email**: Any valid email format (e.g., `demo@example.com`)
- **Password**: Any password (minimum 6 characters)
- **Registration**: Complete 4-step wizard or use demo login

### Key Features to Explore
1. **Login System** - Session-based authentication with validation
2. **Registration Wizard** - 4-step process with form state persistence
3. **Patient Dashboard** - Overview with statistics and recent activity
4. **Information Requests** - Submit and track patient requests
5. **Responsive Design** - Mobile-optimized healthcare interface
6. **Toast Notifications** - Real-time user feedback system

## 🏥 Project Overview

This project demonstrates expertise in building complex healthcare user interfaces with:

- **Multi-step Registration Workflows** with form validation and state persistence
- **Patient Dashboard** with prescription management and refill requests
- **Payment Integration UI** supporting multiple payment vendors
- **Information Request System** with status tracking
- **Profile & Consent Management** with accessibility features
- **Responsive Design** optimized for desktop, tablet, and mobile

## 🛠 Technology Stack

- **Frontend Framework**: Vanilla JavaScript with ES6+ modules (demonstrates raw skills)
- **UI Framework**: Bootstrap 5.3.2 with custom healthcare theming
- **Architecture Pattern**: ASP.NET Core MVC-inspired (Controllers/Services/Models)
- **State Management**: localStorage with session-based authentication
- **Validation**: Custom framework mimicking ASP.NET Core ModelState
- **Routing**: History API with hash fallback for GitHub Pages compatibility
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels
- **Analytics**: Google Analytics integration for portfolio tracking
- **Deployment**: GitHub Pages with automated CI/CD

### Enterprise Patterns Demonstrated
- **Repository Pattern**: Centralized data access layer
- **Service Layer Architecture**: Business logic separation
- **Custom Validation Attributes**: ASP.NET-style validation framework
- **Multi-step Form State Management**: Complex workflow handling
- **Toast Notification System**: User feedback and error handling
- **Protected Route Authentication**: Security middleware patterns

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

## 📦 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automated Deployment
- **Trigger**: Pushes to `master` branch
- **Process**: GitHub Actions workflow builds and deploys to Pages
- **URL**: https://epetaway.github.io/patient-portal-demo/
- **CDN**: Served via GitHub Pages CDN for global performance

### Manual Deployment
```bash
# Build and deploy manually
npm run deploy
```

## 🔧 Development Workflow

This project demonstrates professional development practices:

### Git Workflow
- **Milestone-based commits**: Each major feature as separate commit
- **Descriptive commit messages**: Clear feature descriptions
- **Progressive development**: Incremental feature building

### Code Organization
- **ES6 Modules**: Modern JavaScript architecture
- **Feature-based structure**: Organized by functionality
- **Separation of concerns**: Clean MVC architecture
- **Code documentation**: Inline comments explaining ASP.NET patterns

### Quality Standards
- **ESLint configuration**: Code quality enforcement
- **Consistent naming**: Following C# conventions in JavaScript
- **Error handling**: Comprehensive try/catch and validation
- **Accessibility**: WCAG compliance throughout

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

## 📋 Code Examples

The `/code-examples/` directory contains downloadable code snippets showcasing specific enterprise development patterns:

- **`validation-framework.js`** - Custom validation system mimicking ASP.NET Core ModelState
- **`form-state-manager.js`** - Multi-step form persistence patterns
- **`spa-router.js`** - Client-side routing with authentication guards
- **`auth-service.js`** - Session management and security patterns
- **`notification-system.js`** - Toast notification system

These examples demonstrate how to translate server-side enterprise patterns to client-side implementations.

## 🎯 Professional Skills Demonstrated

### Enterprise Architecture
- **Scalable Code Organization**: Feature-based modular structure
- **Design Patterns**: Repository, Service Layer, Observer patterns
- **State Management**: Complex form state and session handling
- **Error Handling**: Comprehensive validation and user feedback

### Healthcare Domain Experience
- **Patient Portal Functionality**: Real-world healthcare workflows
- **HIPAA Considerations**: Privacy-compliant UI design
- **Prescription Management**: Complex medication workflow UX
- **Insurance Integration**: Multi-vendor payment processing patterns

### Frontend Excellence
- **Responsive Design**: Mobile-first healthcare interface
- **Accessibility**: Full WCAG 2.1 AA compliance
- **Performance**: Optimized loading and smooth interactions
- **Browser Compatibility**: Cross-browser JavaScript patterns

### ASP.NET Core Translation
- **MVC Patterns**: Controllers, Services, Models in JavaScript
- **Validation Framework**: Data Annotations equivalent
- **Authentication**: Identity patterns in client-side code
- **Routing**: Action-based navigation system

## 🤝 Professional Context

This portfolio project demonstrates real-world experience with:

- **Healthcare Software Development**: Patient portal domain expertise gained through enterprise application development
- **ASP.NET Core Expertise**: Deep understanding of Microsoft web development patterns
- **Enterprise Frontend Architecture**: Complex form workflows, validation, and state management
- **Accessibility Standards**: Healthcare industry compliance requirements (WCAG 2.1 AA)
- **Multi-tenant Architecture**: Configurable theming and white-label solution patterns

### Development Methodology

- **Agile Development**: Milestone-based iterative development
- **Clean Code Principles**: SOLID principles applied to JavaScript
- **Enterprise Patterns**: Service layer, repository pattern, dependency injection concepts
- **Performance Optimization**: Efficient DOM manipulation and memory management

## 📞 Contact & Portfolio

**Earl Hickson** - Frontend Developer specializing in Healthcare Applications

- **GitHub**: https://github.com/epetaway
- **Portfolio**: This demo showcases enterprise-level frontend development
- **Expertise**: ASP.NET Core, JavaScript, Healthcare UX, Accessibility

---

## 📄 License & Attribution

**MIT License** - This portfolio project is open source for educational and demonstration purposes.

*This project demonstrates enterprise-level frontend development skills gained through real-world healthcare application development. All patient data is simulated and HIPAA-compliant for demonstration purposes.*

### Acknowledgments

- **Bootstrap 5** - UI framework for rapid development
- **Bootstrap Icons** - Comprehensive icon system
- **GitHub Pages** - Free hosting for portfolio projects
- **Healthcare Design Patterns** - Inspired by real patient portal applications