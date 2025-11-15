/**
 * Routing Service - Mimics ASP.NET Core MVC Routing
 * Handles client-side routing with History API and hash fallback
 */

import authService from './authService.js';

class RoutingService {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.defaultRoute = 'login';
        this.protectedRoutes = ['dashboard', 'prescriptions', 'payments', 'profile', 'requests', 'consent'];
        
        // Initialize routing
        this.initializeRouting();
    }

    /**
     * Initialize routing system
     * Sets up event listeners and handles initial route
     */
    initializeRouting() {
        // Listen for hash changes (primary method for GitHub Pages)
        window.addEventListener('hashchange', () => this.handleRouteChange());
        
        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', () => this.handleRouteChange());
        
        // Handle initial page load
        window.addEventListener('DOMContentLoaded', () => this.handleInitialRoute());
    }

    /**
     * Register a route with its controller and action
     * Similar to ASP.NET Core route registration
     */
    registerRoute(path, controller, action, options = {}) {
        this.routes.set(path, {
            controller,
            action,
            requiresAuth: options.requiresAuth || false,
            title: options.title || 'Patient Portal',
            description: options.description || ''
        });
    }

    /**
     * Navigate to a specific route
     * Similar to ASP.NET Core RedirectToAction
     */
    navigate(path, params = {}) {
        try {
            // Build URL with parameters
            let url = `#${path}`;
            if (Object.keys(params).length > 0) {
                const searchParams = new URLSearchParams(params);
                url += `?${searchParams.toString()}`;
            }
            
            // Update URL without triggering hashchange event
            if (window.location.hash !== url) {
                window.history.pushState(null, null, url);
                this.handleRouteChange();
            }
        } catch (error) {
            console.error('Navigation error:', error);
            this.navigate(this.defaultRoute);
        }
    }

    /**
     * Handle route changes
     */
    handleRouteChange() {
        const { path, params } = this.parseCurrentRoute();
        this.executeRoute(path, params);
    }

    /**
     * Handle initial route on page load
     */
    handleInitialRoute() {
        // Check if user is authenticated
        const isAuthenticated = authService.initialize();
        
        const { path } = this.parseCurrentRoute();
        
        // Redirect logic
        if (!path || path === '') {
            if (isAuthenticated) {
                this.navigate('dashboard');
            } else {
                this.navigate('login');
            }
            return;
        }
        
        this.handleRouteChange();
    }

    /**
     * Parse current route from URL
     */
    parseCurrentRoute() {
        const hash = window.location.hash.slice(1); // Remove #
        const [path, queryString] = hash.split('?');
        
        const params = {};
        if (queryString) {
            const searchParams = new URLSearchParams(queryString);
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
        }
        
        return { path: path || '', params };
    }

    /**
     * Execute route handler
     */
    async executeRoute(path, params = {}) {
        try {
            // Check if route exists
            const route = this.routes.get(path);
            if (!route) {
                console.warn(`Route not found: ${path}`);
                this.navigate(authService.isAuthenticated ? 'dashboard' : 'login');
                return;
            }

            // Check authentication requirement
            if (route.requiresAuth && !authService.checkAuthentication()) {
                console.log('Route requires authentication, redirecting to login');
                this.navigate('login');
                return;
            }

            // Check if trying to access login when authenticated
            if (path === 'login' && authService.checkAuthentication()) {
                this.navigate('dashboard');
                return;
            }

            // Update page metadata
            this.updatePageMetadata(route);

            // Update UI layout based on authentication
            this.updateLayoutVisibility(authService.checkAuthentication());

            // Execute controller action
            await route.controller[route.action](params);
            
            // Update current route
            this.currentRoute = { path, params, route };
            
            // Update navigation active states
            this.updateNavigationState(path);
            
        } catch (error) {
            console.error('Route execution error:', error);
            // Fallback to safe route
            this.navigate(authService.isAuthenticated ? 'dashboard' : 'login');
        }
    }

    /**
     * Update page title and meta tags
     */
    updatePageMetadata(route) {
        document.title = route.title;
        
        // Update meta description if provided
        if (route.description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = route.description;
        }
    }

    /**
     * Show/hide navigation and sidebar based on authentication
     */
    updateLayoutVisibility(isAuthenticated) {
        const nav = document.getElementById('main-nav');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (isAuthenticated) {
            nav.style.display = 'block';
            sidebar.style.display = 'block';
            mainContent.className = 'col-md-9 col-lg-10';
            
            // Update user name in navigation
            const user = authService.getCurrentUser();
            const userNameElement = document.getElementById('user-name');
            if (user && userNameElement) {
                userNameElement.textContent = `Welcome, ${user.firstName || user.email}`;
            }
        } else {
            nav.style.display = 'none';
            sidebar.style.display = 'none';
            mainContent.className = 'col-12';
        }
    }

    /**
     * Update active navigation states
     */
    updateNavigationState(currentPath) {
        // Remove all active classes
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route
        const activeLink = document.querySelector(`#sidebar .nav-link[href="#${currentPath}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Get current route information
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Check if current route requires authentication
     */
    currentRouteRequiresAuth() {
        const { path } = this.parseCurrentRoute();
        return this.protectedRoutes.includes(path);
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        this.navigate('login');
    }

    /**
     * Redirect to dashboard
     */
    redirectToDashboard() {
        this.navigate('dashboard');
    }

    /**
     * Handle 404 errors
     */
    handle404() {
        const isAuthenticated = authService.checkAuthentication();
        this.navigate(isAuthenticated ? 'dashboard' : 'login');
    }
}

// Export singleton instance
export default new RoutingService();