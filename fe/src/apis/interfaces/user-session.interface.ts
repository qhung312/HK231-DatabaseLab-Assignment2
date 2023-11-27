import { IUserInterface } from "@/common/interfaces/auth/user.interface";

export interface IUserSessionPayload {
    username: string,
    password: string,
}
export interface IUserSessionResponse {
    userInfo?: IUserInterface,
    error?: string,
}

export interface IUserSignUpPayload {
    username: string,
    password: string,
    employeeId: string | number,
}

export interface IUserSignUpResponse {
    data?: {
        message: string
    }
    error?: string
}

export type IUserLoginPayload = IUserSessionPayload;
export interface IUserLoginResponse {
    data?: {
        employeeId: string | number,
        username: string,
    }
    error?: string,
}