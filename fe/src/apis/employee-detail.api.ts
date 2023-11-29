import { ISearchEmployeePayload, ISearchEmployeeResponse } from "./interfaces/employee-detail.interface";
import axiosClient from "@/common/helper/axios-client";
/**
 * /employee/search?type=type&role=role&value=value
 * If value is not provided, we will return all employees
 * @param payload 
 * @returns 
 */
export const searchEmployeeApi = async (payload: ISearchEmployeePayload): Promise<ISearchEmployeeResponse> => {
    try {
        const query = [];

        const { type, value, role } = payload;

        if (value) {
            query.push(`${type || "name"}=${value}`);
        }

        if (role) {
            query.push(`role=${role}`);
        }

        const queryString = query.join("&");

        const res = await axiosClient.get(`/employee?${queryString}`);

        const resData = res.data;

        const { error, data } = resData;

        if (error) {
            return {
                error: error
            }
        }

        return {
            data: {
                employees: data
            }
        }
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }
}
