import { IComorbidityInfo, IDemographicInfo, ITestInfo, ITreatmenInfo } from "./form-detail.interface";

export interface IAddPatientInfo {
    demographicInfo: IDemographicInfo;
    comorbidityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
    treatmentInfo: ITreatmenInfo[];
}