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
    },
    error?: string;
}