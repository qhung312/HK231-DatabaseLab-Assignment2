import { IComorbidityInfo, IDemographicInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";

export interface IPatientTestingInfoPayload {
    patientId: string;
}

export interface IPatientTestingInfoResponse {
    data: {
        testInfo: ITestInfo[];
    },
    error?: string;
}

export interface IPatientReportInfoPayload {
    patientId: string;
}

export interface IReportInfoData {
    symptomsInfo: ISymptomInfo[];
    comorbodityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
    treatmentInfo: ITreatmenInfo[];
}

export interface IPatientReportInfoResponse {
    data: {
        reportInfo: IReportInfoData;
    };
    error?: string;
}