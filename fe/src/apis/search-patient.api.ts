import { PATIENT_SEARCH_RESULT } from "@/common/mock-data/patient-search-result";
import { ISearchPatientPayload, ISearchPatientResponse } from "./interfaces/search-patient.interface";

/**
 * GET: /api/search-patient
 * @param payload 
 * @returns 
 */
export const searchPatientApi = async (payload: ISearchPatientPayload): Promise<ISearchPatientResponse> => {
    const mockApiCallResponse: Promise<ISearchPatientResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: PATIENT_SEARCH_RESULT,
            }
            resolve(data);
        }, 1000)
    );

    // const response = axios.get<ISearchPatientResponse>("/api/search-patient", payload);
    return await mockApiCallResponse;
}