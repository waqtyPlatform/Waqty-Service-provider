// ─── Types ───────────────────────────────────────────────────────────────────

export interface Service {
    id: string;
    name: string;
    nameAr?: string; // Arabic service name — rendered under the AR locale (FU/name_ar)
    duration: string;
    durationMins: number;
    price: number;
    category: string;
}

export interface Employee {
    id: string;
    name: string;
    role: string;
    color: string;
    level?: string;
}

export interface Room {
    id: string;
    name: string;
}

export interface BookingItem {
    id: string;
    service: Service;
    employee: Employee;
    date: string;
    time: string;
    room: string;
}

export interface PatientForm {
    age: string;
    gender: string;
    bloodType: string;
    hasAllergies: boolean;
    allergies: string;
    chronicConditions: string[];
    currentMedications: string;
    previousProcedures: string;
    chiefComplaint: string;
    symptoms: string;
    symptomsDuration: string;
    painLevel: string;
    evaluatedBefore: boolean;
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;
    insuranceProvider: string;
    insurancePolicyNo: string;
}
