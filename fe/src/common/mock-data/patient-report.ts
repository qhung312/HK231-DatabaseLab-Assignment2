import { IReportInfo } from "../interfaces/report/report.interface";

export const MOCK_PATIENT_REPORT_INFO: IReportInfo = {
    symptomsInfo: [
        {
            id: 1,
            symptomId: 1,
            description: "Cough",
            seriousness: "High"
        },
        {
            id: 2,
            symptomId: 2,
            description: "Fever",
            seriousness: "Low"
        },
        {
            id: 3,
            symptomId: 3,
            description: "Sore throat",
            seriousness: "High"
        },
    ],
    comorbodityInfo: [
        {
            id: 1,
            comorbidityId: 1,
            description: "Diabetes",
            seriousness: "High"
        },
        {
            id: 2,
            comorbidityId: 2,
            description: "Hypertension",
            seriousness: "High"
        },
        {
            id: 3,
            comorbidityId: 3,
            description: "Cancer",
            seriousness: "Low"
        },
    ],
    treatmentInfo: [
        {
            treatmentId: "1",
            startDate: "2021-09-01T00:00:00.000Z",
            endDate: "2021-09-10T00:00:00.000Z",
            medications: [
                {
                    id: "1",
                    medId: 1,
                    medName: "Paracetamol",
                    expiredDate: "2021-09-01T00:00:00.000Z",
                    effects: [
                        {
                            medEffectId: 1,
                            medEffect: "Headache"
                        },
                        {
                            medEffectId: 2,
                            medEffect: "Nausea"
                        }
                    ],
                    price: 10000
                },
                {
                    id: "2",
                    medId: 2,
                    medName: "Ibuprofen",
                    expiredDate: "2021-09-01T00:00:00.000Z",
                    effects: [
                        {
                            medEffectId: 3,
                            medEffect: "Headache"
                        },
                        {
                            medEffectId: 4,
                            medEffect: "Nausea"
                        }
                    ],
                    price: 10000
                }
            ],
            result: "Recovered"
        },
        {
            treatmentId: "2",
            startDate: "2021-09-01T00:00:00.000Z",
            endDate: "2021-09-10T00:00:00.000Z",
            medications: [
                {
                    id: "3",
                    medId: 3,
                    medName: "Paracetamol",
                    expiredDate: "2021-09-01T00:00:00.000Z",
                    effects: [
                        {
                            medEffectId: 1,
                            medEffect: "Headache"
                        },
                        {
                            medEffectId: 2,
                            medEffect: "Nausea"
                        }
                    ],
                    price: 10000
                },
                {
                    id: "4",
                    medId: 4,
                    medName: "Ibuprofen",
                    expiredDate: "2021-09-01T00:00:00.000Z",
                    effects: [
                        {
                            medEffectId: 3,
                            medEffect: "Headache"
                        },
                        {
                            medEffectId: 4,
                            medEffect: "Nausea",
                        }
                    ],
                    price: 2000,
                }
            ],
            result: "Recovered"
        }
    ],
    testInfo: [
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
    ]

}