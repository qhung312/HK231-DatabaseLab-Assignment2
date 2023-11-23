import axios from "axios";
import { ISearchEmployeePayload, ISearchEmployeeResponse } from "./interfaces/employee-detail.interface";
import { DOCTORS_SEARCH_RESULT, NURSES_SEARCH_RESULT } from "@/common/mock-data/employee-search-result";
/**
 * /api/employee/search?type=type&role=role&value=value
 * If value is not provided, we will return all employees
 * @param payload 
 * @returns 
 */
export const searchEmployeeApi = async (payload: ISearchEmployeePayload): Promise<ISearchEmployeeResponse> => {
    const query = [];

    for (const [key, value] of Object.entries(payload)) {
        if (value) {
            query.push(`${key}=${value}`);
        }
    }

    // const queryString = query.join("&"); // type=id&role=Doctor&value=1

    // const res = await axios.get(`/api/employee/search?${queryString}`);
    // const resData = res.data;

    // const { error, data } = resData;

    // if (error) {
    //     return {
    //         error: error
    //     }
    // }

    // return {
    //     data
    // }

    return {
        data: {
            employees: payload.role === "Nurse" ? NURSES_SEARCH_RESULT : DOCTORS_SEARCH_RESULT, // data.employees,
        }
    };
}
