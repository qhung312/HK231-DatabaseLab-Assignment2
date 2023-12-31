import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IAddPatientInfo } from "@/common/interfaces/form/form.interface";
import { uuid } from 'uuidv4';

export type IAddInstanceInfo = Omit<IAddPatientInfo, 'demographicInfo' | 'comorbidityInfo'>;

const initialState: IAddInstanceInfo = {
    locationBeforeAdmission: "",
    testInfo: [],
    treatmentInfo: [],
    symptomInfo: [],
    careTakerInfo: []
}

const addInstanceReducer = createSlice({
    name: 'addInstanceReducer',
    initialState,
    reducers: {
        setTestInfo: (state, action) => {
            state.testInfo = action.payload;
        },
        setTreatmentInfo: (state, action) => {
            state.treatmentInfo = action.payload;
        },
        setLocationBeforeAdmission: (state, action) => {
            state.locationBeforeAdmission = action.payload;
        },
        setSymptomInfo: (state, action) => {
            state.symptomInfo = action.payload;
        },
        setCareTakerInfo: (state, action) => {
            state.careTakerInfo = action.payload;
        },
        resetStore: (state, action) => {
            state = initialState;
        }
    }
})

export const { setTestInfo, setTreatmentInfo, setSymptomInfo, resetStore, setCareTakerInfo, setLocationBeforeAdmission } = addInstanceReducer.actions;

export const selectTestInfo = (state: RootState) => state.addInstance.testInfo;
export const selectTreatmentInfo = (state: RootState) => state.addInstance.treatmentInfo;
export const selectSymptomInfo = (state: RootState) => state.addInstance.symptomInfo;
export const selectCareTakerInfo = (state: RootState) => state.addInstance.careTakerInfo;
export const selectLocationBeforeAdmission = (state: RootState) => state.addInstance.locationBeforeAdmission;

export default addInstanceReducer.reducer;