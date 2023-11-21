import { IUserSessionPayload, IUserSessionResponse } from "./interfaces";

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
