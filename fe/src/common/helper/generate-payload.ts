import { IAddPatientComorbidity, IAddPatientSymptom } from "@/apis/interfaces/add-patient.interface";
import { IComorbidityInfo, ISymptomInfo } from "../interfaces/form/form-detail.interface";

export const generatePatientComorbidityPayload = (comorbidities: IComorbidityInfo[]): IAddPatientComorbidity[] => {
    const comorbidityPayload: IAddPatientComorbidity[] = [];

    comorbidities.forEach((comorbidity) => {
        const { description, ...rest } = comorbidity;
        comorbidityPayload.push(rest);
    })

    return comorbidityPayload;
}

export const generatePatientSymptomPayload = (symptoms: ISymptomInfo[]): IAddPatientSymptom[] => {
    const symptomPayload: IAddPatientSymptom[] = [];

    symptoms.forEach((symptom) => {
        const { description, ...rest } = symptom;
        symptomPayload.push(rest);
    })

    return symptomPayload;
}