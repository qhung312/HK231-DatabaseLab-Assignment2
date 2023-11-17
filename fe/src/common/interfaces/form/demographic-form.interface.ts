export interface IDemographicInfo {
    uid: string;
    id: string;
    name: string;
    gender: string;
    address: string;
    phone: string;
}

export interface IComorbidityInfo {
    id: string;
    description: string;
    seriousness: string;
}

export interface ITestInfo {
    id: string;
    type: "SPO2 Test" | "PCR Test" | "Quick Test" | "Respiratory Rate Test";
    spo2Rate?: number;
    result?: boolean;
    ctThreshold?: number;
    respiratoryBpm?: number;
}
export interface IDemographicFormProps {
}