/**
 * Data Models - Mimics ASP.NET Core Domain Models
 * Defines the structure for patient portal entities
 */

// Patient model representing user data
export class Patient {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.dateOfBirth = data.dateOfBirth || '';
        this.address = data.address || {};
        this.insurance = data.insurance || {};
        this.enrolledPrograms = data.enrolledPrograms || [];
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

// Prescription model for medication data
export class Prescription {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.patientId = data.patientId || 0;
        this.medicationName = data.medicationName || '';
        this.dosage = data.dosage || '';
        this.frequency = data.frequency || '';
        this.refillsRemaining = data.refillsRemaining || 0;
        this.nextRefillDate = data.nextRefillDate || '';
        this.status = data.status || 'Active';
        this.prescriber = data.prescriber || '';
        this.pharmacy = data.pharmacy || '';
    }

    get canRefill() {
        return this.refillsRemaining > 0 && this.status === 'Active';
    }

    get statusClass() {
        const statusMap = {
            'Active': 'success',
            'Needs Approval': 'warning',
            'Expired': 'danger'
        };
        return statusMap[this.status] || 'secondary';
    }
}

// Information Request model
export class InformationRequest {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.patientId = data.patientId || 0;
        this.type = data.type || '';
        this.description = data.description || '';
        this.status = data.status || 'Pending';
        this.dateSubmitted = data.dateSubmitted || new Date().toISOString().split('T')[0];
        this.dateUpdated = data.dateUpdated || '';
    }

    get statusClass() {
        const statusMap = {
            'Completed': 'success',
            'In Progress': 'primary',
            'Pending': 'warning'
        };
        return statusMap[this.status] || 'secondary';
    }
}

// Payment model for transaction data
export class Payment {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.patientId = data.patientId || 0;
        this.amount = data.amount || 0;
        this.date = data.date || '';
        this.method = data.method || '';
        this.status = data.status || 'Pending';
        this.transactionId = data.transactionId || '';
        this.description = data.description || '';
    }

    get formattedAmount() {
        return `$${this.amount.toFixed(2)}`;
    }
}

// Registration form model
export class RegistrationForm {
    constructor() {
        this.step = 1;
        this.account = {
            email: '',
            password: '',
            confirmPassword: ''
        };
        this.patient = {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: ''
            }
        };
        this.program = {
            medication: '',
            program: '',
            insurance: {
                provider: '',
                memberId: '',
                groupNumber: ''
            }
        };
        this.consent = {
            privacyPolicy: false,
            emailCommunication: false,
            smsCommunication: false
        };
    }
}