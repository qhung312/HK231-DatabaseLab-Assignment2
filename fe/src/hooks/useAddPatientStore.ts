import { IComorbidityInfo, ITestInfo } from "@/common/interfaces/form/demographic-form.interface";
import { selectComorbidityInfo, selectDemographicInfo, selectTestInfo, setComorbidityInfo, setDemographicInfo, setTestInfo } from "@/store/reducers/addPatientReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

const useAddPatientStore = () => {
    const dispatch = useAppDispatch();

    const demographic = useAppSelector(selectDemographicInfo);
    const comorbidities = useAppSelector(selectComorbidityInfo);
    const tests = useAppSelector(selectTestInfo);

    const setDemographicForm = (demographicInfo: any) => {
        dispatch(setDemographicInfo(demographicInfo))
    }

    const setComorbidities = (newComorbidity: IComorbidityInfo, index: number) => {
        const comorbidityInfo = [...comorbidities];
        comorbidityInfo[index] = newComorbidity;

        dispatch(setComorbidityInfo(comorbidityInfo))
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


    return {
        demographic,
        comorbidities,
        tests,
        setDemographicForm,
        addComorbidity,
        removeComorbidity,
        setComorbidities,
        setTestInfos,
        addTestInfo,
        removeTestInfo
    }
}

export default useAddPatientStore;