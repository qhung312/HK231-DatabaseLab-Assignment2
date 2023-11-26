import { IAddPatientPayload } from "@/apis/interfaces/add-patient.interface";
import { generatePatientComorbidityPayload, generatePatientSymptomPayload } from "@/common/helper/generate-payload";
import { IComorbidityInfo, IMedicationEffect, IMedicationInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";
import { ICareTakerBriefInfo } from "@/common/interfaces/form/form.interface";
import { selectCareTakerInfo, selectSymptomInfo, selectTestInfo, selectTreatmentInfo, setSymptomInfo, setTreatmentInfo, setTestInfo, setCareTakerInfo, resetStore } from "@/store/reducers/addInstaceReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

export type IAddInstancePayload = Omit<IAddPatientPayload, 'demographic' | "comorbidities">;

const useAddInstaceStore = () => {
    const dispatch = useAppDispatch();

    const tests = useAppSelector(selectTestInfo);
    const treatments = useAppSelector(selectTreatmentInfo);
    const symptoms = useAppSelector(selectSymptomInfo);
    const careTakers = useAppSelector(selectCareTakerInfo);

    const addSymptomInfo = (newSymptom: ISymptomInfo) => {
        const newSymptomState = [...symptoms, newSymptom];

        dispatch(setSymptomInfo(newSymptomState));
    }

    const removeSymptomInfo = (index: number) => {
        const newSymptomState = [...symptoms];
        newSymptomState.splice(index, 1);

        dispatch(setSymptomInfo(newSymptomState));
    }

    const setSymptomInfos = (newSymptom: ISymptomInfo, index: number) => {
        const symptomInfo = [...symptoms];
        symptomInfo[index] = newSymptom;

        dispatch(setSymptomInfo(symptomInfo))
    }

    const setTestInfos = (newTestInfo: ITestInfo, index: number) => {
        const testInfo = [...tests];
        testInfo[index] = newTestInfo;

        dispatch(setTestInfo(testInfo))
    }

    const addTestInfo = (newTestInfo: ITestInfo) => {
        const newTestInfoState = [...tests, newTestInfo];

        dispatch(setTestInfo(newTestInfoState));
    }

    const removeTestInfo = (index: number) => {
        const newTestInfoState = [...tests];
        newTestInfoState.splice(index, 1);

        dispatch(setTestInfo(newTestInfoState));
    }

    const addTreatmentInfo = (treatmentInfo: ITreatmenInfo) => {
        const newTreatmentInfoState = [...treatments, treatmentInfo];

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    const setTreatmentInfos = (newTreatmentInfo: ITreatmenInfo, index: number) => {
        const treatmentInfo = [...treatments];
        treatmentInfo[index] = newTreatmentInfo;

        dispatch(setTreatmentInfo(treatmentInfo))
    }

    const removeTreatmentInfo = (index: number) => {
        const newTreatmentInfoState = [...treatments];
        newTreatmentInfoState.splice(index, 1);

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    const addMedicationInfo = (medicationInfo: IMedicationInfo, treatmentIndex: number) => {
        const newTreatmentInfoState = structuredClone(treatments);

        newTreatmentInfoState[treatmentIndex].medications.push(medicationInfo);

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    const removeMedicationInfo = (medicationIndex: number, treatmentIndex: number) => {
        const newTreatmentInfoState = structuredClone(treatments);

        newTreatmentInfoState[treatmentIndex].medications.splice(medicationIndex, 1);

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    // Work around
    const setMedicationInfos = (medicationInfo: IMedicationInfo, medicationIndex: number, treatmentIndex: number) => {
        const newTreatmentInfoState = structuredClone(treatments);

        newTreatmentInfoState[treatmentIndex].medications[medicationIndex] = medicationInfo;

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    };


    const addMedicationEffect = (medicationEffect: IMedicationEffect, medicationIndex: number, treatmentIndex: number) => {
        const newTreatmentInfoState = structuredClone(treatments);

        newTreatmentInfoState[treatmentIndex].medications[medicationIndex].effects.push(medicationEffect);

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    const removeMedicationEffect = (medicationEffectIndex: number, medicationIndex: number, treatmentIndex: number) => {
        const newTreatmentInfoState = structuredClone(treatments);

        newTreatmentInfoState[treatmentIndex].medications[medicationIndex].effects.splice(medicationEffectIndex, 1);

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    const setMedicationEffect = (medicationEffect: IMedicationEffect, medicationEffectIndex: number, medicationIndex: number, treatmentIndex: number) => {
        const newTreatmentInfoState = structuredClone(treatments);

        newTreatmentInfoState[treatmentIndex].medications[medicationIndex].effects[medicationEffectIndex] = medicationEffect;

        dispatch(setTreatmentInfo(newTreatmentInfoState));
    }

    const setNurseInfo = (nurseInfo: ICareTakerBriefInfo) => {
        const clonedCareTakerInfoState = structuredClone(careTakers);

        const newCareTakerInfoState = clonedCareTakerInfoState.map((careTaker) => {
            if (careTaker.role === "Nurse") {
                return nurseInfo;
            }

            return careTaker;
        })

        if (newCareTakerInfoState.every((careTaker) => careTaker.role !== "Nurse")) {
            newCareTakerInfoState.push(nurseInfo);
        }

        dispatch(setCareTakerInfo(newCareTakerInfoState));
    }

    const getAddPatientPayload = (): IAddInstancePayload => {
        const symptomsPayload = generatePatientSymptomPayload(symptoms)

        return {
            tests,
            treatments,
            symptoms: symptomsPayload,
            careTakers,
        }
    }

    const resetAddPatientForm = () => {
        dispatch(resetStore({}))
    }

    const symptomFunctions = {
        addSymptomInfo,
        removeSymptomInfo,
        setSymptomInfos
    }

    const testFunctions = {
        setTestInfos,
        addTestInfo,
        removeTestInfo
    }

    const treatmentFunctions = {
        addTreatmentInfo,
        setTreatmentInfos,
        removeTreatmentInfo,
        addMedicationInfo,
        removeMedicationInfo,
        setMedicationInfos,
        addMedicationEffect,
        removeMedicationEffect,
        setMedicationEffect
    }

    const careTakerFunctions = {
        setNurseInfo
    }

    return {
        tests,
        treatments,
        symptoms,
        careTakers,
        symptomFunctions,
        testFunctions,
        treatmentFunctions,
        careTakerFunctions,
        getAddPatientPayload,
        resetAddPatientForm
    }
}

export default useAddInstaceStore;