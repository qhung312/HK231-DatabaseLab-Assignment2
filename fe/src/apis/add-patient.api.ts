import { IAddNewInstancePayload, IAddPatientPayload, IAddPatientResponse, IFetchComorbidityResponse, IFetchMedicationPayload, IFetchMedicationResponse, IFetchSymptomResponse } from "./interfaces/add-patient.interface";
import axiosClient from "@/common/helper/axios-client";

/**
 * POST: /add-patient
 * @param payload 
 * @returns 
 */
export const addPatientApi = async (payload: IAddPatientPayload): Promise<IAddPatientResponse> => {
    try {
        const res = await axiosClient.post('/patient', payload);

        const data = res.data as IAddPatientResponse;
        return data;
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }
}

/**
 * GET: /fetch-symptoms
 * @returns 
 */
export const fetchSymptomsApi = async (): Promise<IFetchSymptomResponse> => {
    const res = await axiosClient.get('/symptom');

    const { data, error } = res.data;

    const ret = {
        data: {
            symptoms: data ?? []
        },
        error: error
    }

    return ret;
}

/**
 * GET: /fetch-comorbidities
 * @returns 
 */
export const fetchComorbiditiesApi = async (): Promise<IFetchComorbidityResponse> => {
    try {
        const res = await axiosClient.get('/comorbidity');

        const { data, error } = res.data;

        const ret = {
            data: {
                comorbidities: data ?? []
            },
            error: error
        }

        return ret;
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }
}

/**
 * GET
 * @param payload 
 * @returns 
 */
export const fetchMedicationApi = async (payload: IFetchMedicationPayload): Promise<IFetchMedicationResponse> => {
    try {
        const { medId } = payload
        const endpoint = "/medication/" + medId;

        const res = await axiosClient.get(endpoint);
        const resData = res.data;

        let medications = [];

        switch (typeof resData.data) {
            case "object":
                medications = [resData.data];
                break;
            default:
                medications = resData.data ?? [];
                break;
        }

        return {
            data: {
                medications
            },
            error: resData.error
        }
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }
}

export const addInstanceApi = async (payload: IAddNewInstancePayload): Promise<IAddPatientResponse> => {
    try {
        const {
            patientId,
            ...rest
        } = payload;

        const body = rest

        const res = await axiosClient.post(`patient/${patientId}/instance`, body);

        const data = res.data as IAddPatientResponse;
        return data;
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }

}