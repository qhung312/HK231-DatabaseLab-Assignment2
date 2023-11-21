import { IComorbidityInfo } from "@/common/interfaces/form/form-detail.interface";

export interface ISearchPatientPayload {
    type: "id" | "name" | "phone";
    value: string;
}

export type IBriefComorbidityInfo = Pick<IComorbidityInfo, "description" | "seriousness">;

export interface ISearchPatientData {
    id: string;
    name: string;
    phone: string;
    comorbidities: IBriefComorbidityInfo[];
}

export interface ISearchPatientResponse {
    data?: ISearchPatientData[];
    error?: string;
}