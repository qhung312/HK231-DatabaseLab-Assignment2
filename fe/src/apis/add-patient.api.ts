import { IAddPatientPayload, IAddPatientResponse } from "./interfaces/add-patient.interface";

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
                    success: true
                }
            }
            resolve(data);
        }, 1000)
    );

    // const response = axios.post<IAddPatientResponse>("/api/add-patient", payload);
    return await mockApiCallResponse;
}