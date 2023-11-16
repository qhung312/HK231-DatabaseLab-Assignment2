'use client'
import { COOKIES_AUTH } from "@/common/constants/auth";
import { IUserInterface } from "@/common/interfaces/auth/user.interface";
import { removeUser, selectUserSession, setUser } from "@/store/reducers/sessionReducer";
import { useCookies } from "next-client-cookies";
import { useDispatch, useSelector } from "react-redux";

const useSessionStore = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserSession);
    const cookies = useCookies()

    const setUserSession = (userInfo: IUserInterface) => {
        const { username } = userInfo

        cookies.set(COOKIES_AUTH, username); // should set cookie on server side when having full API
        dispatch(setUser(username));
    }

    const deleteUserSession = () => {
        cookies.remove(COOKIES_AUTH)
        dispatch(removeUser());
    }

    return { user, setUserSession, deleteUserSession };
}

export default useSessionStore;