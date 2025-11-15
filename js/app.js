/**
 * Main Application Bootstrap - Mimics ASP.NET Core Program.cs
 * Initializes services and starts the application
 */

import authService from './services/authService.js';
import routingService from './services/routingService.js';
import notificationService from './services/notificationService.js';

// Import Controllers (will be created in next milestone)
import AuthController from './controllers/authController.js';
import DashboardController from './controllers/dashboardController.js';
import RegistrationController from './controllers/registrationController.js';
import PrescriptionController from './controllers/prescriptionController.js';
import PaymentController from './controllers/paymentController.js';
import ProfileController from './controllers/profileController.js';

/**
 * Application class - Main application orchestrator
 */
class App {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize application
     * Similar to ASP.NET Core Startup.cs ConfigureServices and Configure
     */
    async initialize() {
        try {
            console.log('Initializing Patient Portal Application...');

            // Initialize core services
            await this.initializeServices();

            // Register routes
            this.registerRoutes();

            // Setup global event handlers
            this.setupGlobalHandlers();

            // Mark as initialized
            this.initialized = true;

            console.log('Application initialized successfully');
            
            // Start routing (will handle initial route)
            // Note: Routing service auto-initializes on construction

        } catch (error) {
            console.error('Application initialization failed:', error);
            notificationService.showError(
                'Application failed to start. Please refresh the page.',
                'Initialization Error'
            );
        }
    }

    /**
     * Initialize all application services
     */
    async initializeServices() {
        // Services are already initialized as singletons
        // This method can be used for any async initialization if needed
        console.log('Services initialized');
    }

    /**
     * Register all application routes
     * Similar to ASP.NET Core route configuration
     */
    registerRoutes() {
        console.log('Registering application routes...');

        // Public routes
        routingService.registerRoute('login', AuthController, 'showLogin', {
            title: 'Login - Patient Portal',
            description: 'Patient portal login page'
        });

        routingService.registerRoute('register', RegistrationController, 'showRegistration', {
            title: 'Register - Patient Portal',
            description: 'New patient registration'
        });

        // Protected routes (require authentication)
        routingService.registerRoute('dashboard', DashboardController, 'showDashboard', {
            requiresAuth: true,
            title: 'Dashboard - Patient Portal',
            description: 'Patient dashboard with prescriptions and account information'
        });

        routingService.registerRoute('prescriptions', PrescriptionController, 'showPrescriptions', {
            requiresAuth: true,
            title: 'Prescriptions - Patient Portal',
            description: 'Manage prescriptions and refill requests'
        });

        routingService.registerRoute('requests', DashboardController, 'showRequests', {
            requiresAuth: true,
            title: 'Information Requests - Patient Portal',
            description: 'Submit and track information requests'
        });

        routingService.registerRoute('payments', PaymentController, 'showPayments', {
            requiresAuth: true,
            title: 'Payments - Patient Portal',
            description: 'Manage payment methods and view payment history'
        });

        routingService.registerRoute('profile', ProfileController, 'showProfile', {
            requiresAuth: true,
            title: 'Profile - Patient Portal',
            description: 'Manage patient profile information'
        });

        routingService.registerRoute('consent', ProfileController, 'showConsent', {
            requiresAuth: true,
            title: 'Consent Settings - Patient Portal',
            description: 'Manage privacy and communication preferences'
        });

        console.log('Routes registered successfully');
    }

    /**
     * Setup global event handlers
     */
    setupGlobalHandlers() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            notificationService.showError(
                'An unexpected error occurred. Please try again.',
                'Application Error'
            );
        });

        // Global unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            notificationService.showError(
                'A network or processing error occurred. Please try again.',
                'Request Failed'
            );
        });

        // Make controllers globally available for inline event handlers
        window.AuthController = AuthController;
        window.DashboardController = DashboardController;
        window.RegistrationController = RegistrationController;
        window.PrescriptionController = PrescriptionController;
        window.PaymentController = PaymentController;
        window.ProfileController = ProfileController;

        // Global logout handler
        window.logout = () => {
            authService.logout();
        };

        // Global authentication check
        window.requireAuth = () => {
            return authService.requireAuth();
        };

        console.log('Global handlers setup complete');
    }

    /**
     * Check if application is ready
     */
    isReady() {
        return this.initialized;
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            authenticated: authService.isAuthenticated,
            currentUser: authService.getCurrentUser(),
            currentRoute: routingService.getCurrentRoute()
        };
    }
}

// Create and start application
const app = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
    app.initialize();
}

// Export for debugging purposes
window.PatientPortalApp = app;

export default app;