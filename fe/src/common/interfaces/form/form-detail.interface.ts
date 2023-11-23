export interface IDemographicInfo {
    uid?: string;
    id: string; // ID number
    name: string;
    gender: string;
    address: string;
    phone: string;
}

export interface ISymptomInfo {
    id?: string | number; // unique id for frontend or has_symptom (if needed)
    symptomId: string | number;
    description: string;
    seriousness?: string;
}

export interface IComorbidityInfo {
    id?: string | number;
    comorbidityId: string | number;
    description: string;
    seriousness?: string;
}

export interface ITestInfo {
    id: string | number;
    type: "SPO2 Test" | "PCR Test" | "Quick Test" | "Respiratory Rate Test";

    spo2Rate?: number;
    result?: boolean;
    ctThreshold?: number;
    respiratoryBpm?: number;

    timestamp?: string;
}

export interface IMedicationEffect {
    medEffectId: string | number;
    medEffect: string;
}

export interface IMedicationInfo {
    id?: string;
    medId: string | number;
    medName: string;
    expiredDate: string;
    effects: IMedicationEffect[];
    price: string | number;
}
export interface ITreatmenInfo {
    doctorId: string;
    treatmentId: string;
    startDate: string;
    endDate: string;
    medications: IMedicationInfo[];
    result: string;
}
export interface IDemographicFormProps {
}

export interface IMedicationFormProps {
    medications: IMedicationInfo[];
    treatmentIndex: number;
}

export interface IMedicationEffectsFormProps {
    medicationIndex: number;
    treatmentIndex: number;
    medicationEffects: IMedicationEffect[];
}