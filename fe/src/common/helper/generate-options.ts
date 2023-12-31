import { IComorbidityInfo, IMedicationInfo, ISymptomInfo } from "../interfaces/form/form-detail.interface";

export const generateSymptomsOptions = (symptoms: ISymptomInfo[]) => {
    return symptoms.map((symptom) => ({
        label: symptom.description,
        value: symptom.symptomId,
    }));
}

export const generateComorbiditiesOptions = (comorbidities: IComorbidityInfo[]) => {
    return comorbidities.map((comorbidity) => ({
        label: comorbidity.description,
        value: comorbidity.comorbidityId,
    }));
}

export const generateMedicationOptions = (medications: IMedicationInfo[]) => {
    return medications.map((medication) => ({
        label: medication.medName,
        value: medication.medId,
        ...medication
    }));
}