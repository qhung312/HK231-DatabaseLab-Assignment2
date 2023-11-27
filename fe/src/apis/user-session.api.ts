import axiosClient from "@/common/helper/axios-client";
import { IUserSessionPayload, IUserSessionResponse, IUserSignUpPayload, IUserSignUpResponse } from "./interfaces";

export const fetchUserSession = async (payload: IUserSessionPayload): Promise<IUserSessionResponse> => {
    const mockApiCallResponse: Promise<IUserSessionResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                userInfo: {
                    username: payload.username,
                },
            }
            resolve(data);
        }, 1000)
    );

    // TODO: replace this mock api call with real api call
    // const response = await axios.get<IUserSessionResponse>("/api/user-session", payload);

    return await mockApiCallResponse;
};

export const signUpApi = async (payload: IUserSignUpPayload): Promise<IUserSignUpResponse> => {
    const res = await axiosClient.post('/auth/signup', payload);

    const resData = res.data;

    const { data, error } = resData;

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