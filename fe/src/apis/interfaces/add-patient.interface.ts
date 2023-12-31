import { IComorbidityInfo, IDemographicInfo, IMedicationInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";
import { ICareTakerBriefInfo } from "@/common/interfaces/form/form.interface";
import { IAddInstancePayload } from "@/hooks";

export type IAddPatientComorbidity = Omit<IComorbidityInfo, "description">;

export type IAddPatientSymptom = Omit<ISymptomInfo, "description">;

export interface IAddPatientPayload {
    demographic: IDemographicInfo,
    locationBeforeAdmission: string,
    comorbidities: IAddPatientComorbidity[],
    symptoms: IAddPatientSymptom[],
    treatments: ITreatmenInfo[],
    tests: ITestInfo[],
    careTakers: ICareTakerBriefInfo[],
}

export type IAddNewInstancePayload = {
    patientId: string;
} & IAddInstancePayload

export interface IAddPatientResponse {
    data?: {
        success: boolean;
        patientId: string;
    },
    error?: string;
}

export type IFetchSymptomData = Pick<ISymptomInfo, "description" | "symptomId">
export type IFetchComorbidityData = Pick<IComorbidityInfo, "description" | "comorbidityId">
export interface IFetchSymptomResponse {
    data?: {
        symptoms: IFetchSymptomData[]
    },
    error?: string;
}

export interface IFetchComorbidityResponse {
    data?: {
        comorbidities: IFetchComorbidityData[]
    },
    error?: string;
}

export interface IFetchMedicationPayload {
    name?: string;
    id?: string;
}

export interface IFetchMedicationResponse {
    data?: {
        medications: IMedicationInfo[]
    },
    error?: string;
}