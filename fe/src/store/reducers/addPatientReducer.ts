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
    },
    comorbidityInfo: [],
    testInfo: [],
    treatmentInfo: [],
    symptomInfo: []
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
        setComorbidityInfo: (state, action) => {
            state.comorbidityInfo = action.payload;
        },
        setTestInfo: (state, action) => {
            state.testInfo = action.payload;
        },
        setTreatmentInfo: (state, action) => {
            state.treatmentInfo = action.payload;
        },
        setSymptomInfo: (state, action) => {
            state.symptomInfo = action.payload;
        }
    }
})

export const { setDemographicInfo, setComorbidityInfo, setTestInfo, setTreatmentInfo, setSymptomInfo } = addPatientReducer.actions;

export const selectDemographicInfo = (state: RootState) => state.addPatient.demographicInfo;
export const selectComorbidityInfo = (state: RootState) => state.addPatient.comorbidityInfo;
export const selectTestInfo = (state: RootState) => state.addPatient.testInfo;
export const selectTreatmentInfo = (state: RootState) => state.addPatient.treatmentInfo;
export const selectSymptomInfo = (state: RootState) => state.addPatient.symptomInfo;

export default addPatientReducer.reducer;