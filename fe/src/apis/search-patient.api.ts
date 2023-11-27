import { PATIENT_SEARCH_RESULT } from "@/common/mock-data/patient-search-result";
import { ISearchPatientPayload, ISearchPatientResponse } from "./interfaces/search-patient.interface";
import axiosClient from "@/common/helper/axios-client";

/**
 * GET: /api/search-patient
 * @param payload 
 * @returns 
 */
export const searchPatientApi = async (payload: ISearchPatientPayload): Promise<ISearchPatientResponse> => {
    const { type, value } = payload;

    const queryString = `?${type}=${value}`;
    const endpoint = `/patient${queryString}`;

    const res = await axiosClient.get<ISearchPatientResponse>(endpoint);
    const resData = res.data;

    const { error, data } = resData;

    if (error) {
        return {
            error
        }
    }
    console.log(data);
    return {
        data
    }
}