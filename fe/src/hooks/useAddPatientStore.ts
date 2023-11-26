import { IAddPatientPayload } from "@/apis/interfaces/add-patient.interface";
import { generatePatientComorbidityPayload, generatePatientSymptomPayload } from "@/common/helper/generate-payload";
import { IComorbidityInfo, IMedicationEffect, IMedicationInfo, ISymptomInfo, ITestInfo, ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface";
import { ICareTakerBriefInfo } from "@/common/interfaces/form/form.interface";
import { resetStore, selectCareTakerInfo, selectComorbidityInfo, selectDemographicInfo, selectLocationBeforeAdmission, selectSymptomInfo, selectTestInfo, selectTreatmentInfo, setCareTakerInfo, setComorbidityInfo, setDemographicInfo, setLocationBeforeAdmission, setSymptomInfo, setTestInfo, setTreatmentInfo } from "@/store/reducers/addPatientReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

const useAddPatientStore = () => {
    const dispatch = useAppDispatch();

    const demographic = useAppSelector(selectDemographicInfo);
    const comorbidities = useAppSelector(selectComorbidityInfo);
    const tests = useAppSelector(selectTestInfo);
    const treatments = useAppSelector(selectTreatmentInfo);
    const symptoms = useAppSelector(selectSymptomInfo);
    const careTakers = useAppSelector(selectCareTakerInfo);
    const locationBeforeAdmission = useAppSelector(selectLocationBeforeAdmission);

    const setDemographicForm = (demographicInfo: any) => {
        dispatch(setDemographicInfo(demographicInfo))
    }

    const setLocation = (location: string) => {
        dispatch(setLocationBeforeAdmission(location))
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

    const getAddPatientPayload = (): IAddPatientPayload => {
        const comorbiditiesPayload = generatePatientComorbidityPayload(comorbidities)
        const symptomsPayload = generatePatientSymptomPayload(symptoms)

        return {
            demographic,
            tests,
            treatments,
            comorbidities: comorbiditiesPayload,
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

    const careTakerFunctions = {
        setNurseInfo
    }

    return {
        demographic,
        comorbidities,
        tests,
        treatments,
        symptoms,
        careTakers,
        symptomFunctions,
        comorbidityFunctions,
        testFunctions,
        treatmentFunctions,
        careTakerFunctions,
        locationBeforeAdmission,
        setLocation,
        setDemographicForm,
        getAddPatientPayload,
        resetAddPatientForm
    }
}

export default useAddPatientStore;