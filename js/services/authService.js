/**
 * Authentication Service - Mimics ASP.NET Core Identity
 * Handles user authentication and session management
 */

import dataService from './dataService.js';

class AuthService {
    constructor() {
        this.storageKey = 'patientPortal_session';
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    /**
     * Initialize authentication service
     * Check for existing session on app startup
     */
    initialize() {
        const sessionData = localStorage.getItem(this.storageKey);
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (this.isSessionValid(session)) {
                    this.currentUser = session.user;
                    this.isAuthenticated = true;
                    console.log('Session restored for user:', this.currentUser.email);
                    return true;
                }
            } catch (error) {
                console.error('Invalid session data:', error);
                this.clearSession();
            }
        }
        return false;
    }

    /**
     * Login user with email and password
     * Simulates ASP.NET Core SignInManager authentication
     */
    async login(email, password) {
        try {
            // For demo purposes, any non-empty email/password works
            if (!email || !password) {
                return {
                    success: false,
                    message: 'Email and password are required'
                };
            }

            // Simulate authentication delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get or create demo user
            let user = await dataService.getPatientByEmail(email);
            if (!user) {
                // Create demo user for any email
                user = {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: email,
                    phone: '(555) 123-4567'
                };
            }

            // Create session
            const session = {
                user: user,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            };

            // Store session
            localStorage.setItem(this.storageKey, JSON.stringify(session));
            this.currentUser = user;
            this.isAuthenticated = true;

            return {
                success: true,
                user: user,
                message: 'Login successful'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed. Please try again.'
            };
        }
    }

    /**
     * Logout current user
     */
    logout() {
        this.clearSession();
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Redirect to login
        window.location.hash = '#login';
        
        return {
            success: true,
            message: 'Logout successful'
        };
    }

    /**
     * Get current authenticated user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    checkAuthentication() {
        if (!this.isAuthenticated) {
            return false;
        }

        const sessionData = localStorage.getItem(this.storageKey);
        if (!sessionData) {
            this.isAuthenticated = false;
            return false;
        }

        try {
            const session = JSON.parse(sessionData);
            return this.isSessionValid(session);
        } catch (error) {
            this.clearSession();
            return false;
        }
    }

    /**
     * Validate session expiration
     */
    isSessionValid(session) {
        if (!session.expiresAt) return false;
        return new Date(session.expiresAt) > new Date();
    }

    /**
     * Clear stored session data
     */
    clearSession() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Require authentication for protected routes
     */
    requireAuth() {
        if (!this.checkAuthentication()) {
            window.location.hash = '#login';
            return false;
        }
        return true;
    }

    /**
     * Update current user profile
     */
    async updateProfile(userData) {
        if (!this.isAuthenticated) {
            return { success: false, message: 'Not authenticated' };
        }

        try {
            const updated = await dataService.updatePatient({
                ...this.currentUser,
                ...userData
            });

            if (updated) {
                // Update session with new data
                this.currentUser = { ...this.currentUser, ...userData };
                const sessionData = JSON.parse(localStorage.getItem(this.storageKey));
                sessionData.user = this.currentUser;
                localStorage.setItem(this.storageKey, JSON.stringify(sessionData));

                return { success: true, message: 'Profile updated successfully' };
            }

            return { success: false, message: 'Failed to update profile' };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Profile update failed' };
        }
    }
}

// Export singleton instance
export default new AuthService();