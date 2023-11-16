import { IUserInterface } from "@/common/interfaces/auth/user.interface";

export interface IUserSessionPayload {
    username: string,
    password: string,
}

export interface IUserSessionResponse {
    userInfo: IUserInterface,
    error?: string,
}