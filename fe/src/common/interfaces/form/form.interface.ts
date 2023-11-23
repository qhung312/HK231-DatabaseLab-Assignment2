import { IComorbidityInfo, IDemographicInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "./form-detail.interface";

export interface ICareTakerBriefInfo {
    id: string | number;
    role: "Nurse" | "Volunteer";
}
export interface IAddPatientInfo {
    demographicInfo: IDemographicInfo;
    comorbidityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
    treatmentInfo: ITreatmenInfo[];
    symptomInfo: ISymptomInfo[];
    careTakerInfo: ICareTakerBriefInfo[];
}