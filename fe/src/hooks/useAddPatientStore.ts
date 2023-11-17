import { selectDemographicInfo, setDemographicInfo } from "@/store/reducers/addPatientReducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

const useAddPatientStore = () => {
    const dispatch = useAppDispatch();
    const demographic = useAppSelector(selectDemographicInfo);

    const setDemographicForm = (demographicInfo: any) => {
        dispatch(setDemographicInfo(demographicInfo))
    }

    return {
        demographic,
        setDemographicForm,
    }
}

export default useAddPatientStore;