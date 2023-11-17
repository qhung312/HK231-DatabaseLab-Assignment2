import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IAddPatientInfo } from "@/common/interfaces/form/form.interface";
import { uuid } from 'uuidv4';
const initialState: IAddPatientInfo = {
    demographicInfo: {
        uid: uuid(),
        id: "",
        name: "",
        gender: "",
        address: "",
        phone: "",
    }
}

const addPatientReducer = createSlice({
    name: 'addPatientReducer',
    initialState,
    reducers: {
        setDemographicInfo: (state, action) => {
            const prev = { ...state.demographicInfo };

            state.demographicInfo = {
                ...prev,
                ...action.payload
            }
        },
    }
})

export const { setDemographicInfo } = addPatientReducer.actions;

export const selectDemographicInfo = (state: RootState) => state.addPatient.demographicInfo;

export default addPatientReducer.reducer;