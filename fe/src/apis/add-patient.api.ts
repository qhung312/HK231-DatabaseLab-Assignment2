import { MOCK_COMORBIDITY_DATA, MOCK_SYMPTOMS_DATA } from "@/common/mock-data/form-search-result";
import { IAddPatientPayload, IAddPatientResponse, IFetchComorbidityResponse, IFetchSymptomResponse } from "./interfaces/add-patient.interface";

/**
 * POST: /api/add-patient
 * @param payload 
 * @returns 
 */
export const addPatientApi = async (payload: IAddPatientPayload): Promise<IAddPatientResponse> => {
    const mockApiCallResponse: Promise<IAddPatientResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: {
                    success: true,
                    patientId: "123456789"
                }
            }
            resolve(data);
        }, 3000)
    );

    // const response = axios.post<IAddPatientResponse>("/api/add-patient", payload);
    return await mockApiCallResponse;
}

export const fetchSymptomsApi = async (): Promise<IFetchSymptomResponse> => {
    const mockApiCallResponse: Promise<IFetchSymptomResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: {
                    symptoms: MOCK_SYMPTOMS_DATA
                }
            }
            resolve(data);
        }, 2000)
    );

    return await mockApiCallResponse;
}

export const fetchComorbiditiesApi = async (): Promise<IFetchComorbidityResponse> => {
    const mockApiCallResponse: Promise<IFetchComorbidityResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: {
                    comorbidities: MOCK_COMORBIDITY_DATA
                }
            }
            resolve(data);
        }, 2000)
    );

    return await mockApiCallResponse;
}