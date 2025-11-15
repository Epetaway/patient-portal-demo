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
}

// Export singleton instance
export default new DataService();