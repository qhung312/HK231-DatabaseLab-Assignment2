import { IComorbidityInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "../form/form-detail.interface";

export interface IReportInfo {
    symptomsInfo: ISymptomInfo[];
    comorbodityInfo: IComorbidityInfo[];
    testInfo: ITestInfo[];
    treatmentInfo: ITreatmenInfo[];
}