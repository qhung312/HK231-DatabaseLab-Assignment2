import { IComorbidityInfo, IDemographicInfo, ITestInfo } from "./demographic-form.interface";

export interface IAddPatientInfo {
    demographicInfo: IDemographicInfo;
    comorbidityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
}