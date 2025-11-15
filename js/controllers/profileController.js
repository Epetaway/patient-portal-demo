/**
 * Profile Controller - Profile Management
 * Handles user profile editing, preferences, and account settings
 */

import authService from '../services/authService.js';
import dataService from '../services/dataService.js';
import notificationService from '../services/notificationService.js';
import ValidationService from '../services/validationService.js';

class ProfileController {
    static async showProfile(params = {}) {
        try {
            const pageContent = document.getElementById('page-content');
            const user = authService.getCurrentUser();
            
            if (!user) {
                notificationService.showError('User session not found');
                return;
            }

            // Load extended profile data
            const profile = await dataService.getPatientProfile(user.id);

            const profileHtml = `
                <div class="fade-in">
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2>My Profile</h2>
                            <p class="text-muted">Manage your personal information and preferences</p>
                        </div>
                    </div>
                    
                    <!-- Profile Navigation Tabs -->
                    <div class="row">
                        <div class="col-12">
                            <ul class="nav nav-tabs mb-4" id="profileTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="personal-tab" data-bs-toggle="tab" 
                                            data-bs-target="#personal-info" type="button" role="tab">
                                        <i class="bi bi-person me-2"></i>Personal Information
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" 
                                            data-bs-target="#contact-info" type="button" role="tab">
                                        <i class="bi bi-envelope me-2"></i>Contact & Address
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="preferences-tab" data-bs-toggle="tab" 
                                            data-bs-target="#preferences" type="button" role="tab">
                                        <i class="bi bi-gear me-2"></i>Preferences
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="security-tab" data-bs-toggle="tab" 
                                            data-bs-target="#security" type="button" role="tab">
                                        <i class="bi bi-shield-lock me-2"></i>Security
                                    </button>
                                </li>
                            </ul>
                            
                            <div class="tab-content" id="profileTabContent">
                                <!-- Personal Information Tab -->
                                <div class="tab-pane fade show active" id="personal-info" role="tabpanel">
                                    ${this.renderPersonalInfoTab(profile)}
                                </div>
                                
                                <!-- Contact & Address Tab -->
                                <div class="tab-pane fade" id="contact-info" role="tabpanel">
                                    ${this.renderContactInfoTab(profile)}
                                </div>
                                
                                <!-- Preferences Tab -->
                                <div class="tab-pane fade" id="preferences" role="tabpanel">
                                    ${this.renderPreferencesTab(profile)}
                                </div>
                                
                                <!-- Security Tab -->
                                <div class="tab-pane fade" id="security" role="tabpanel">
                                    ${this.renderSecurityTab(profile)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Change Password Modal -->
                <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Change Password</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="changePasswordForm" novalidate>
                                    <div class="mb-3">
                                        <label for="currentPassword" class="form-label">Current Password</label>
                                        <input type="password" class="form-control" id="currentPassword" name="currentPassword" required>
                                        <div id="currentPassword-error" class="invalid-feedback"></div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="newPassword" class="form-label">New Password</label>
                                        <input type="password" class="form-control" id="newPassword" name="newPassword" 
                                               minlength="8" required>
                                        <div id="newPassword-error" class="invalid-feedback"></div>
                                        <div class="form-text">Password must be at least 8 characters long</div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" 
                                               minlength="8" required>
                                        <div id="confirmPassword-error" class="invalid-feedback"></div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" onclick="ProfileController.changePassword()">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            pageContent.innerHTML = profileHtml;

        } catch (error) {
            console.error('Profile page error:', error);
            notificationService.showError('Failed to load profile data');
        }
    }

    /**
     * Render personal information tab
     */
    static renderPersonalInfoTab(profile) {
        return `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Personal Information</h5>
                </div>
                <div class="card-body">
                    <form id="personalInfoForm" novalidate>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="firstName" class="form-label">First Name *</label>
                                <input type="text" class="form-control" id="firstName" name="firstName" 
                                       value="${profile.firstName}" required>
                                <div id="firstName-error" class="invalid-feedback"></div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName" class="form-label">Last Name *</label>
                                <input type="text" class="form-control" id="lastName" name="lastName" 
                                       value="${profile.lastName}" required>
                                <div id="lastName-error" class="invalid-feedback"></div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="dateOfBirth" class="form-label">Date of Birth *</label>
                                <input type="date" class="form-control" id="dateOfBirth" name="dateOfBirth" 
                                       value="${profile.dateOfBirth}" required>
                                <div id="dateOfBirth-error" class="invalid-feedback"></div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="gender" class="form-label">Gender</label>
                                <select class="form-control" id="gender" name="gender">
                                    <option value="">Prefer not to say</option>
                                    <option value="M" ${profile.gender === 'M' ? 'selected' : ''}>Male</option>
                                    <option value="F" ${profile.gender === 'F' ? 'selected' : ''}>Female</option>
                                    <option value="O" ${profile.gender === 'O' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="ssn" class="form-label">Social Security Number</label>
                                <input type="text" class="form-control" id="ssn" name="ssn" 
                                       value="${profile.ssnMasked}" placeholder="XXX-XX-1234" readonly>
                                <small class="text-muted">Contact support to update SSN</small>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="emergencyContact" class="form-label">Emergency Contact</label>
                                <input type="text" class="form-control" id="emergencyContact" name="emergencyContact" 
                                       value="${profile.emergencyContact || ''}" placeholder="Name and phone number">
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i>Save Changes
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Render contact information tab
     */
    static renderContactInfoTab(profile) {
        return `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Contact & Address Information</h5>
                </div>
                <div class="card-body">
                    <form id="contactInfoForm" novalidate>
                        <h6 class="text-primary mb-3">Contact Information</h6>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="email" class="form-label">Email Address *</label>
                                <input type="email" class="form-control" id="email" name="email" 
                                       value="${profile.email}" required>
                                <div id="email-error" class="invalid-feedback"></div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="phone" class="form-label">Phone Number *</label>
                                <input type="tel" class="form-control" id="phone" name="phone" 
                                       value="${profile.phone}" required>
                                <div id="phone-error" class="invalid-feedback"></div>
                            </div>
                        </div>
                        
                        <h6 class="text-primary mb-3 mt-4">Mailing Address</h6>
                        
                        <div class="mb-3">
                            <label for="address1" class="form-label">Address Line 1 *</label>
                            <input type="text" class="form-control" id="address1" name="address1" 
                                   value="${profile.address.line1}" required>
                            <div id="address1-error" class="invalid-feedback"></div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="address2" class="form-label">Address Line 2</label>
                            <input type="text" class="form-control" id="address2" name="address2" 
                                   value="${profile.address.line2 || ''}" placeholder="Apartment, suite, etc.">
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="city" class="form-label">City *</label>
                                <input type="text" class="form-control" id="city" name="city" 
                                       value="${profile.address.city}" required>
                                <div id="city-error" class="invalid-feedback"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="state" class="form-label">State *</label>
                                <select class="form-control" id="state" name="state" required>
                                    <option value="">Select state...</option>
                                    <option value="AL" ${profile.address.state === 'AL' ? 'selected' : ''}>Alabama</option>
                                    <option value="CA" ${profile.address.state === 'CA' ? 'selected' : ''}>California</option>
                                    <option value="FL" ${profile.address.state === 'FL' ? 'selected' : ''}>Florida</option>
                                    <option value="NY" ${profile.address.state === 'NY' ? 'selected' : ''}>New York</option>
                                    <option value="TX" ${profile.address.state === 'TX' ? 'selected' : ''}>Texas</option>
                                    <!-- Add more states as needed -->
                                </select>
                                <div id="state-error" class="invalid-feedback"></div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="zipCode" class="form-label">ZIP Code *</label>
                                <input type="text" class="form-control" id="zipCode" name="zipCode" 
                                       value="${profile.address.zipCode}" required>
                                <div id="zipCode-error" class="invalid-feedback"></div>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i>Update Contact Information
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Render preferences tab
     */
    static renderPreferencesTab(profile) {
        return `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Communication & Application Preferences</h5>
                </div>
                <div class="card-body">
                    <form id="preferencesForm" novalidate>
                        <h6 class="text-primary mb-3">Communication Preferences</h6>
                        
                        <div class="mb-4">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="emailNotifications" 
                                       name="emailNotifications" ${profile.preferences.emailNotifications ? 'checked' : ''}>
                                <label class="form-check-label" for="emailNotifications">
                                    <strong>Email Notifications</strong>
                                    <div class="text-muted small">Receive prescription updates, appointment reminders, and important announcements via email</div>
                                </label>
                            </div>
                            
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="smsNotifications" 
                                       name="smsNotifications" ${profile.preferences.smsNotifications ? 'checked' : ''}>
                                <label class="form-check-label" for="smsNotifications">
                                    <strong>SMS Text Messages</strong>
                                    <div class="text-muted small">Get text alerts for prescription refills and urgent updates</div>
                                </label>
                            </div>
                            
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="marketingEmails" 
                                       name="marketingEmails" ${profile.preferences.marketingEmails ? 'checked' : ''}>
                                <label class="form-check-label" for="marketingEmails">
                                    <strong>Marketing Communications</strong>
                                    <div class="text-muted small">Receive information about new services, health tips, and promotional offers</div>
                                </label>
                            </div>
                        </div>
                        
                        <h6 class="text-primary mb-3">Application Settings</h6>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="language" class="form-label">Preferred Language</label>
                                <select class="form-control" id="language" name="language">
                                    <option value="en" ${profile.preferences.language === 'en' ? 'selected' : ''}>English</option>
                                    <option value="es" ${profile.preferences.language === 'es' ? 'selected' : ''}>Español</option>
                                    <option value="fr" ${profile.preferences.language === 'fr' ? 'selected' : ''}>Français</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="timezone" class="form-label">Time Zone</label>
                                <select class="form-control" id="timezone" name="timezone">
                                    <option value="America/New_York" ${profile.preferences.timezone === 'America/New_York' ? 'selected' : ''}>Eastern Time</option>
                                    <option value="America/Chicago" ${profile.preferences.timezone === 'America/Chicago' ? 'selected' : ''}>Central Time</option>
                                    <option value="America/Denver" ${profile.preferences.timezone === 'America/Denver' ? 'selected' : ''}>Mountain Time</option>
                                    <option value="America/Los_Angeles" ${profile.preferences.timezone === 'America/Los_Angeles' ? 'selected' : ''}>Pacific Time</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-save me-2"></i>Save Preferences
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Render security tab
     */
    static renderSecurityTab(profile) {
        return `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Security Settings</h5>
                </div>
                <div class="card-body">
                    <h6 class="text-primary mb-3">Password Management</h6>
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Password last changed:</strong> ${profile.lastPasswordChange}
                    </div>
                    
                    <button type="button" class="btn btn-outline-primary mb-4" data-bs-toggle="modal" data-bs-target="#changePasswordModal">
                        <i class="bi bi-key me-2"></i>Change Password
                    </button>
                    
                    <h6 class="text-primary mb-3">Account Activity</h6>
                    
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Activity</th>
                                    <th>Device</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${profile.recentActivity.map(activity => `
                                    <tr>
                                        <td>${activity.date}</td>
                                        <td>${activity.action}</td>
                                        <td>${activity.device}</td>
                                        <td>${activity.location}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <h6 class="text-primary mb-3 mt-4">Privacy Settings</h6>
                    
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="shareDataResearch" 
                               name="shareDataResearch" ${profile.privacy.shareDataForResearch ? 'checked' : ''}>
                        <label class="form-check-label" for="shareDataResearch">
                            <strong>Allow data sharing for medical research</strong>
                            <div class="text-muted small">Help improve healthcare by anonymously sharing your health data for research purposes</div>
                        </label>
                    </div>
                    
                    <div class="form-check mb-4">
                        <input class="form-check-input" type="checkbox" id="twoFactorAuth" 
                               name="twoFactorAuth" ${profile.security.twoFactorEnabled ? 'checked' : ''}>
                        <label class="form-check-label" for="twoFactorAuth">
                            <strong>Enable two-factor authentication (coming soon)</strong>
                            <div class="text-muted small">Add an extra layer of security to your account</div>
                        </label>
                    </div>
                    
                    <button type="button" class="btn btn-primary" onclick="ProfileController.saveSecuritySettings()">
                        <i class="bi bi-save me-2"></i>Update Security Settings
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Change password functionality
     */
    static async changePassword() {
        try {
            const form = document.getElementById('changePasswordForm');
            const formData = new FormData(form);
            
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');
            
            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                notificationService.showError('Please fill in all password fields.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                notificationService.showError('New passwords do not match.');
                return;
            }
            
            if (newPassword.length < 8) {
                notificationService.showError('New password must be at least 8 characters long.');
                return;
            }
            
            // Show loading state
            const submitBtn = document.querySelector('#changePasswordModal .btn-primary');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating...';
            submitBtn.disabled = true;

            const user = authService.getCurrentUser();
            
            // Change password
            const result = await dataService.changePassword(user.id, currentPassword, newPassword);
            
            if (result.success) {
                notificationService.showSuccess('Password changed successfully.');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                modal.hide();
                
                // Clear form
                form.reset();
            } else {
                notificationService.showError(result.message || 'Failed to change password.');
            }
            
        } catch (error) {
            console.error('Change password error:', error);
            notificationService.showError('Failed to change password due to a technical error.');
        } finally {
            // Restore button state
            const submitBtn = document.querySelector('#changePasswordModal .btn-primary');
            if (submitBtn) {
                submitBtn.innerHTML = 'Change Password';
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * Save security settings
     */
    static async saveSecuritySettings() {
        try {
            const shareDataResearch = document.getElementById('shareDataResearch').checked;
            const twoFactorAuth = document.getElementById('twoFactorAuth').checked;
            
            const user = authService.getCurrentUser();
            
            const result = await dataService.updateSecuritySettings(user.id, {
                shareDataForResearch: shareDataResearch,
                twoFactorEnabled: twoFactorAuth
            });
            
            if (result.success) {
                notificationService.showSuccess('Security settings updated successfully.');
            } else {
                notificationService.showError(result.message || 'Failed to update security settings.');
            }
            
        } catch (error) {
            console.error('Security settings error:', error);
            notificationService.showError('Failed to update security settings.');
        }
    }
}

// Make globally available
window.ProfileController = ProfileController;

export default ProfileController;