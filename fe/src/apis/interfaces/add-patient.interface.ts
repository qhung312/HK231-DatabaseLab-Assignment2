import { IComorbidityInfo, IDemographicInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";

export type IAddPatientComorbidity = Omit<IComorbidityInfo, "description">;

export type IAddPatientSymptom = Omit<ISymptomInfo, "description">;

export interface IAddPatientPayload {
    demographic: IDemographicInfo,
    comorbidities: IAddPatientComorbidity[],
    symptoms: IAddPatientSymptom[],
    treatments: ITreatmenInfo[],
    tests: ITestInfo[]
}

export interface IAddPatientResponse {
    data: {
        success: boolean;
        patientId: string;
    },
    error?: string;
}

export type IFetchSymptomData = Pick<ISymptomInfo, "description" | "symptomId">
export type IFetchComorbidityData = Pick<IComorbidityInfo, "description" | "comorbidityId">
export interface IFetchSymptomResponse {
    data: {
        symptoms: IFetchSymptomData[]
    },
    error?: string;
}

export interface IFetchComorbidityResponse {
    data: {
        comorbidities: IFetchComorbidityData[]
    },
    error?: string;
}