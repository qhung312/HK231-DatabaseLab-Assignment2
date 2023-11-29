import { ISearchPatientPayload, ISearchPatientResponse } from "./interfaces/search-patient.interface";
import axiosClient from "@/common/helper/axios-client";
import { notification } from "antd";

/**
 * GET: /api/search-patient
 * @param payload 
 * @returns 
 */
export const searchPatientApi = async (payload: ISearchPatientPayload): Promise<ISearchPatientResponse> => {
    try {
        const { type, value } = payload;

        const queryString = `?${type}=${value}`;
        const endpoint = `/patient${queryString}`;

        const res = await axiosClient.get<ISearchPatientResponse>(endpoint);
        const resData = res.data;

        const { error, data } = resData;

        if (error) {
            notification.error({ message: error });
            return {
                error
            }
        }

        return {
            data
        }
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }

}