import { IUserInterface } from "@/common/interfaces/auth/user.interface";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: IUserInterface = {
    username: ""
}

const sessionReducer = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload;
        },
        removeUser: (state) => {
            state.username = "";
        }
    }
})

export const { setUser, removeUser } = sessionReducer.actions;

export const selectUserSession = (state: RootState) => state.session.username;

export default sessionReducer.reducer;