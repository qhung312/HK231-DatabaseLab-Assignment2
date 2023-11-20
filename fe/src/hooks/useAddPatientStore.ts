import { IAddPatientPayload } from "@/apis/interfaces/add-patient.interface";
import { generatePatientComorbidityPayload, generatePatientSymptomPayload } from "@/common/helper/generate-payload";
import { IComorbidityInfo, IMedicationEffect, IMedicationInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";
import { resetStore, selectComorbidityInfo, selectDemographicInfo, selectSymptomInfo, selectTestInfo, selectTreatmentInfo, setComorbidityInfo, setDemographicInfo, setSymptomInfo, setTestInfo, setTreatmentInfo } from "@/store/reducers/addPatientReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

const useAddPatientStore = () => {
    const dispatch = useAppDispatch();

    const demographic = useAppSelector(selectDemographicInfo);
    const comorbidities = useAppSelector(selectComorbidityInfo);
    const tests = useAppSelector(selectTestInfo);
    const treatments = useAppSelector(selectTreatmentInfo);
    const symptoms = useAppSelector(selectSymptomInfo);

    const setDemographicForm = (demographicInfo: any) => {
        dispatch(setDemographicInfo(demographicInfo))
    }

    const setComorbidities = (newComorbidity: IComorbidityInfo, index: number) => {
        const comorbidityInfo = [...comorbidities];
        comorbidityInfo[index] = newComorbidity;

        dispatch(setComorbidityInfo(comorbidityInfo))
    }

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

    const addComorbidity = (newComorbidity: IComorbidityInfo) => {
        const newComorbidityState = [...comorbidities, newComorbidity];

        dispatch(setComorbidityInfo(newComorbidityState));
    }

    const removeComorbidity = (index: number) => {
        const newComorbidityState = [...comorbidities];
        newComorbidityState.splice(index, 1);

        dispatch(setComorbidityInfo(newComorbidityState));
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

    const getAddPatientPayload = (): IAddPatientPayload => {
        const comorbiditiesPayload = generatePatientComorbidityPayload(comorbidities)
        const symptomsPayload = generatePatientSymptomPayload(symptoms)

        return {
            demographic,
            tests,
            treatments,
            comorbidities: comorbiditiesPayload,
            symptoms: symptomsPayload
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

    const comorbidityFunctions = {
        addComorbidity,
        removeComorbidity,
        setComorbidities
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

    return {
        demographic,
        comorbidities,
        tests,
        treatments,
        symptoms,
        symptomFunctions,
        comorbidityFunctions,
        testFunctions,
        treatmentFunctions,
        setDemographicForm,
        getAddPatientPayload,
        resetAddPatientForm
    }
}

export default useAddPatientStore;