import { MOCK_COMORBIDITY_DATA, MOCK_MEDICATION_DATA, MOCK_SYMPTOMS_DATA } from "@/common/mock-data/form-search-result";
import { IAddPatientPayload, IAddPatientResponse, IFetchComorbidityResponse, IFetchMedicationPayload, IFetchMedicationResponse, IFetchSymptomResponse } from "./interfaces/add-patient.interface";
import axiosClient from "@/common/helper/axios-client";

/**
 * POST: /api/add-patient
 * @param payload 
 * @returns 
 */
export const addPatientApi = async (payload: IAddPatientPayload): Promise<IAddPatientResponse> => {
    // const mockApiCallResponse: Promise<IAddPatientResponse> = new Promise((resolve) =>
    //     setTimeout(() => {
    //         const data = {
    //             data: {
    //                 success: true,
    //                 patientId: "123456789"
    //             }
    //         }
    //         resolve(data);
    //     }, 3000)
    // );

    const res = await axiosClient.post('/patient', payload);

    const data = res.data as IAddPatientResponse;
    console.log(data);
    // const response = axios.post<IAddPatientResponse>("/api/add-patient", payload);
    return data;
}

/**
 * GET: /api/fetch-symptoms
 * @returns 
 */
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

/**
 * GET: /api/fetch-comorbidities
 * @returns 
 */
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

/**
 * GET /api/fetch-medication
 * @param payload 
 * @returns 
 */
export const fetchMedicationApi = async (payload: IFetchMedicationPayload): Promise<IFetchMedicationResponse> => {
    const mockApiCallResponse: Promise<IFetchMedicationResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: {
                    medications: MOCK_MEDICATION_DATA
                }
            }
            resolve(data);
        }, 1000)
    );

    return await mockApiCallResponse;
}