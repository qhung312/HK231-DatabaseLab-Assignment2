import { IPatientSearchResult } from "../interfaces/search/patient-search.interface";

export const PATIENT_SEARCH_RESULT: IPatientSearchResult[] = [
    {
        id: '1',
        name: 'John Doe',
        phone: '1234567890',
        comorbidities: [
            {
                description: 'Diabetes',
                seriousness: 'High'
            },
            {
                description: 'Hypertension',
                seriousness: 'High'
            }
        ]
    },
    {
        id: '2',
        name: 'John',
        phone: '1234567890',
        comorbidities: [
            {
                description: 'Diabetes',
                seriousness: 'Low'
            },
            {
                description: 'Hypertension',
                seriousness: 'Unknown'
            }
        ]
    },
    {
        id: '3',
        name: 'Doe',
        phone: '1234567890',
        comorbidities: [
            {
                description: 'Cancer',
                seriousness: 'Low'
            },
            {
                description: 'Hypertension',
                seriousness: 'Unknown'
            }
        ]
    }
]