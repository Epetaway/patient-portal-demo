/**
 * Data Service - Mimics ASP.NET Core Repository Pattern
 * Handles all data operations with mock JSON data
 */

import { Patient, Prescription, InformationRequest, Payment } from '../models/models.js';

class DataService {
    constructor() {
        this.data = null;
        this.initialized = false;
    }

    /**
     * Initialize data service - loads mock data from JSON file
     * Similar to Entity Framework DbContext initialization
     */
    async initialize() {
        if (this.initialized) return;
        
        try {
            const response = await fetch('./data.json');
            this.data = await response.json();
            this.initialized = true;
            console.log('DataService initialized successfully');
        } catch (error) {
            console.error('Failed to initialize DataService:', error);
            // Fallback to empty data structure
            this.data = {
                patients: [],
                prescriptions: [],
                payments: [],
                informationRequests: [],
                paymentMethods: [],
                consentSettings: [],
                programs: [],
                medications: [],
                requestTypes: []
            };
        }
    }

    /**
     * Patient data operations
     */
    async getPatientById(id) {
        await this.initialize();
        const patientData = this.data.patients.find(p => p.id === id);
        return patientData ? new Patient(patientData) : null;
    }

    async getPatientByEmail(email) {
        await this.initialize();
        const patientData = this.data.patients.find(p => p.email === email);
        return patientData ? new Patient(patientData) : null;
    }

    async updatePatient(patient) {
        await this.initialize();
        const index = this.data.patients.findIndex(p => p.id === patient.id);
        if (index !== -1) {
            this.data.patients[index] = { ...patient };
            return true;
        }
        return false;
    }

    /**
     * Prescription data operations
     */
    async getPrescriptionsByPatientId(patientId) {
        await this.initialize();
        return this.data.prescriptions
            .filter(p => p.patientId === patientId)
            .map(p => new Prescription(p));
    }

    async requestRefill(prescriptionId, pharmacy = null) {
        await this.initialize();
        const prescription = this.data.prescriptions.find(p => p.id === prescriptionId);
        if (prescription && prescription.refillsRemaining > 0) {
            // Simulate refill request processing
            return {
                success: true,
                message: `Refill request submitted for ${prescription.medicationName}`,
                confirmationNumber: 'RX' + Math.random().toString(36).substr(2, 9).toUpperCase()
            };
        }
        return {
            success: false,
            message: 'Unable to process refill request'
        };
    }

    /**
     * Information Request operations
     */
    async getInformationRequestsByPatientId(patientId) {
        await this.initialize();
        return this.data.informationRequests
            .filter(r => r.patientId === patientId)
            .map(r => new InformationRequest(r));
    }

    async submitInformationRequest(patientId, type, description) {
        await this.initialize();
        const newRequest = {
            id: this.data.informationRequests.length + 1,
            patientId: patientId,
            type: type,
            description: description,
            status: 'Pending',
            dateSubmitted: new Date().toISOString().split('T')[0],
            dateUpdated: new Date().toISOString().split('T')[0]
        };
        
        this.data.informationRequests.push(newRequest);
        return {
            success: true,
            message: 'Information request submitted successfully',
            requestId: newRequest.id
        };
    }

    /**
     * Payment operations
     */
    async getPaymentsByPatientId(patientId) {
        await this.initialize();
        return this.data.payments
            .filter(p => p.patientId === patientId)
            .map(p => new Payment(p));
    }

    async processPayment(patientId, amount, method, description) {
        await this.initialize();
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newPayment = {
            id: this.data.payments.length + 1,
            patientId: patientId,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            method: method,
            status: 'Completed',
            transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            description: description
        };
        
        this.data.payments.push(newPayment);
        return {
            success: true,
            payment: new Payment(newPayment),
            message: 'Payment processed successfully'
        };
    }

    /**
     * Reference data operations
     */
    async getPrograms() {
        await this.initialize();
        return this.data.programs;
    }

    async getMedications() {
        await this.initialize();
        return this.data.medications;
    }

    async getRequestTypes() {
        await this.initialize();
        return this.data.requestTypes;
    }

    /**
     * Consent operations
     */
    async getConsentSettings(patientId) {
        await this.initialize();
        return this.data.consentSettings.find(c => c.patientId === patientId) || {};
    }

    async updateConsentSettings(patientId, settings) {
        await this.initialize();
        const index = this.data.consentSettings.findIndex(c => c.patientId === patientId);
        const updatedSettings = {
            patientId: patientId,
            ...settings,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        if (index !== -1) {
            this.data.consentSettings[index] = updatedSettings;
        } else {
            this.data.consentSettings.push(updatedSettings);
        }
        
        return { success: true, message: 'Consent settings updated successfully' };
    }

    /**
     * Registration operations
     */
    async registerPatient(registrationData) {
        await this.initialize();
        
        // Simulate registration processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newPatient = {
            id: this.data.patients.length + 1,
            firstName: registrationData.patient.firstName,
            lastName: registrationData.patient.lastName,
            email: registrationData.account.email,
            phone: registrationData.patient.phone,
            dateOfBirth: registrationData.patient.dateOfBirth,
            address: registrationData.patient.address,
            insurance: registrationData.program.insurance,
            enrolledPrograms: [registrationData.program.program]
        };
        
        this.data.patients.push(newPatient);
        return {
            success: true,
            patient: new Patient(newPatient),
            message: 'Registration completed successfully'
        };
    }

    /**
     * Get prescriptions by patient ID
     */
    async getPrescriptionsByPatientId(patientId) {
        await this.delay(800);
        
        const mockPrescriptions = [
            {
                id: 1,
                medicationName: 'Lisinopril 10mg',
                dosage: '10mg',
                frequency: 'Once daily',
                prescriber: 'Dr. Sarah Johnson',
                pharmacy: 'CVS Pharmacy - Main St',
                refillsRemaining: 3,
                status: 'Active',
                statusClass: 'success',
                canRefill: true,
                nextRefillDate: '2025-12-01'
            },
            {
                id: 2,
                medicationName: 'Metformin 500mg',
                dosage: '500mg',
                frequency: 'Twice daily',
                prescriber: 'Dr. Michael Chen',
                pharmacy: 'Walgreens - Oak Ave',
                refillsRemaining: 0,
                status: 'Needs Approval',
                statusClass: 'warning',
                canRefill: false,
                nextRefillDate: null
            },
            {
                id: 3,
                medicationName: 'Atorvastatin 20mg',
                dosage: '20mg',
                frequency: 'Once daily at bedtime',
                prescriber: 'Dr. Emily Rodriguez',
                pharmacy: 'Local Pharmacy',
                refillsRemaining: 2,
                status: 'Active',
                statusClass: 'success',
                canRefill: true,
                nextRefillDate: '2025-11-25'
            }
        ];
        
        return mockPrescriptions;
    }

    /**
     * Request prescription refill
     */
    async requestRefill(prescriptionId, pharmacy, comments = '') {
        await this.delay(1200);
        
        const confirmationNumber = 'RF' + Date.now().toString().slice(-6);
        
        return {
            success: true,
            message: 'Refill request submitted successfully.',
            confirmationNumber: confirmationNumber,
            estimatedReady: '24-48 hours'
        };
    }

    /**
     * Get payments by patient ID
     */
    async getPaymentsByPatientId(patientId) {
        await this.delay(600);
        
        const mockPayments = [
            {
                id: 1,
                date: '2025-11-10',
                description: 'Prescription Copay - Lisinopril',
                amount: 25.00,
                formattedAmount: '$25.00',
                method: 'Credit Card (**** 1234)',
                status: 'Completed',
                transactionId: 'TXN789456123'
            },
            {
                id: 2,
                date: '2025-10-15',
                description: 'Healthcare Service Fee',
                amount: 150.00,
                formattedAmount: '$150.00',
                method: 'PayPal',
                status: 'Completed',
                transactionId: 'TXN654321987'
            },
            {
                id: 3,
                date: '2025-09-20',
                description: 'Medication Copay - Metformin',
                amount: 30.00,
                formattedAmount: '$30.00',
                method: 'Credit Card (**** 5678)',
                status: 'Completed',
                transactionId: 'TXN123789456'
            }
        ];
        
        return mockPayments;
    }

    /**
     * Process payment
     */
    async processPayment(patientId, amount, paymentMethod, reason) {
        await this.delay(2000);
        
        const transactionId = 'TXN' + Date.now().toString().slice(-9);
        
        const payment = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            description: reason,
            amount: amount,
            formattedAmount: `$${amount.toFixed(2)}`,
            method: paymentMethod,
            status: 'Completed',
            transactionId: transactionId
        };
        
        return {
            success: true,
            message: 'Payment processed successfully',
            payment: payment
        };
    }

    /**
     * Get patient profile
     */
    async getPatientProfile(patientId) {
        await this.delay(500);
        
        return {
            id: patientId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567',
            dateOfBirth: '1985-06-15',
            gender: 'M',
            ssnMasked: 'XXX-XX-1234',
            emergencyContact: 'Jane Doe - (555) 987-6543',
            address: {
                line1: '123 Main Street',
                line2: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zipCode: '10001'
            },
            preferences: {
                emailNotifications: true,
                smsNotifications: true,
                marketingEmails: false,
                language: 'en',
                timezone: 'America/New_York'
            },
            privacy: {
                shareDataForResearch: false
            },
            security: {
                twoFactorEnabled: false
            },
            lastPasswordChange: '2025-09-15',
            recentActivity: [
                {
                    date: '2025-11-15',
                    action: 'Account Login',
                    device: 'Chrome on MacOS',
                    location: 'New York, NY'
                },
                {
                    date: '2025-11-14',
                    action: 'Password Changed',
                    device: 'Safari on iPhone',
                    location: 'New York, NY'
                },
                {
                    date: '2025-11-10',
                    action: 'Profile Updated',
                    device: 'Chrome on MacOS',
                    location: 'New York, NY'
                }
            ]
        };
    }

    /**
     * Change user password
     */
    async changePassword(patientId, currentPassword, newPassword) {
        await this.delay(1500);
        
        if (currentPassword !== 'password') {
            return {
                success: false,
                message: 'Current password is incorrect.'
            };
        }
        
        return {
            success: true,
            message: 'Password changed successfully.'
        };
    }

    /**
     * Update security settings
     */
    async updateSecuritySettings(patientId, settings) {
        await this.delay(800);
        
        return {
            success: true,
            message: 'Security settings updated successfully.'
        };
    }
}

// Export singleton instance
export default new DataService();