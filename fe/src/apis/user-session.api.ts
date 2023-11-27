import axiosClient from "@/common/helper/axios-client";
import { IUserLoginPayload, IUserLoginResponse, IUserSessionPayload, IUserSessionResponse, IUserSignUpPayload, IUserSignUpResponse } from "./interfaces";

export const fetchUserSession = async (): Promise<IUserSessionResponse> => {

    const res = await axiosClient.get('/auth/session', { withCredentials: true });

    const resData = res.data;

    const { data, error } = resData;

    if (data.error || error) {
        return {
            error: data.error || error,
        }
    }

    return {
        userInfo: data.userInfo,
    };
}

export const signUpApi = async (payload: IUserSignUpPayload): Promise<IUserSignUpResponse> => {
    try {
        const res = await axiosClient.post('/auth/signup', payload);

        const resData = res.data;

        const { data, error } = resData;
        console.log(data)

        if (data.error || error) {
            return {
                error: data.error || error,
            }
        }

        if (res.status === 200) {
            return {
                data: {
                    message: data,
                }
            };
        };

        return {
            error: error,
        }
    }
    catch (err) {
        return {
            error: `${JSON.stringify(err)}` || 'Something went wrong',
        }
    }
}

export const signInApi = async (payload: IUserLoginPayload): Promise<IUserLoginResponse> => {
    try {
        const res = await axiosClient.post('/auth/login', payload);

        const resData = res.data;

        const { data, error } = resData;
        console.log(data)

        if (data.error || error) {
            return {
                error: data.error || error,
            }
        }

        if (res.status === 200) {
            return {
                data: {
                    employeeId: data.employeeId,
                    username: data.username,
                }
            };
        };

        return {
            error: error,
        }
    }
    catch (err: any) {
        return {
            error: err?.response?.data?.error as string || 'Something went wrong',
        }
    }

}