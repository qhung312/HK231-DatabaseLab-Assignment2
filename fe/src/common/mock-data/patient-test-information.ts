import { IDemographicInfo, ITestInfo } from "../interfaces/form/form-detail.interface";

export const MOCK_TEST_INFO_DATA: ITestInfo[] = [
    {
        id: 1,
        type: "SPO2 Test",
        spo2Rate: 0.44,
        timestamp: "2021-09-01T00:00:00.000Z",
    },
    {
        id: 2,
        type: "PCR Test",
        ctThreshold: 20,
        result: true,
        timestamp: "2022-09-01T00:00:00.000Z",
    },
    {
        id: 3,
        type: "Quick Test",
        result: false,
        timestamp: "2023-09-01T00:00:00.000Z",
    },
    {
        id: 4,
        type: "Respiratory Rate Test",
        respiratoryBpm: 20,
        timestamp: "2024-09-01T00:00:00.000Z",
    },
];

export const MOCK_TEST_DEMOGRAPHIC_DATA: IDemographicInfo = {
    id: "2153342",
    name: "Nguyen Van A",
    gender: "Male",
    address: "268 Ly Thuong Kiet Sts, District 10, Ho Chi Minh City",
    phone: "0123456789",
}