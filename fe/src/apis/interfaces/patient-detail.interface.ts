import { IComorbidityInfo, IDemographicInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";

export interface IPatientTestingInfoPayload {
    patientId: string;
    patientInstanceOrder: string;
}

export interface IPatientTestingInfoResponse {
    data?: {
        testInfo: ITestInfo[];
    },
    error?: string;
}

export interface IPatientReportInfoPayload {
    patientId: string;
    patientInstanceOrder: string;
}

export interface IPatientInstanceInfoPayload {
    patientId: string;
}
export interface IPatientDemographicInfoPayload {
    patientId: string;
}

export interface IReportInfoData {
    symptomsInfo: ISymptomInfo[];
    comorbidityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
    treatmentInfo: ITreatmenInfo[];
}

export interface IPatientReportInfoResponse {
    data?: {
        reportInfo: IReportInfoData;
    };
    error?: string;
}

export interface IPatientInstance {
    patientOrder: number | string;
    admissionTime: string;
    assignedNurseId: string;
    locationBeforeAdmission: string;
    isWarning: boolean;
}

export interface IPatientInstanceInfoResponse {
    data?: {
        instanceInfo: IPatientInstance[];
    };
    error?: string;
}

export interface IPatientDemographicInfoResponse {
    data?: {
        demographicInfo: IDemographicInfo;
    };
    error?: string;
}