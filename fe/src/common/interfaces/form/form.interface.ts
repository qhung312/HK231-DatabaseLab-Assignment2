import { IComorbidityInfo, IDemographicInfo, ITestInfo } from "./form-detail.interface";

export interface IAddPatientInfo {
    demographicInfo: IDemographicInfo;
    comorbidityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
}