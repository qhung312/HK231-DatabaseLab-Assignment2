import useAddPatientStore from "@/hooks/useAddPatientStore"
import { Form, Select, notification } from "antd"
import { useEffect, useState } from "react";
import { SearchBarState } from "@/common/interfaces/search/patient-search.interface";
import { EMPLOYEE_SEARCH_TYPE } from "@/common/constants/add-patient-form.constant";
import { useDebounce } from "@/hooks";
import { searchEmployeeApi } from "@/apis";
import { IEmployeeBriefInfo } from "@/apis/interfaces/employee-detail.interface";

export const CareTakerForm = () => {
    const { careTakers, careTakerFunctions } = useAddPatientStore();
    const { setNurseInfo } = careTakerFunctions;


    const [isLoading, setIsLoading] = useState(false);
    const [searchNurseOptions, setSearchNurseOptions] = useState<{
        value: string | number; // nurse id;
        label: string; // nurse name;
    }[]>([]);

    const [searchBarState, setSearchBarState] = useState<SearchBarState>({
        type: EMPLOYEE_SEARCH_TYPE[0].value,
        value: "",
    });

    const debouncedSearchBarValue = useDebounce(searchBarState.value, 500);
    const debouncedSearchBarType = useDebounce(searchBarState.type, 500);


    const nurseInCareTakers = () => {
        return careTakers.find((careTaker) => careTaker.role === "Nurse")
    }

    const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    const onTypeSelect = (value: string) => {
        setSearchBarState(prevSearchBarState => {
            return {
                ...prevSearchBarState,
                type: value
            }
        })
    }

    const generateNurseOptions = (nurses: IEmployeeBriefInfo[]) => {
        return nurses.map((nurse) => {
            return {
                value: nurse.employeeId,
                label: nurse.name,
            }
        })
    }

    const onNurseSelect = (value: string) => {
        setNurseInfo({
            id: value,
            role: "Nurse"
        })
    }

    useEffect(() => {
        setIsLoading(true);
        const searchEmployee = async () => {

            const { data, error } = await searchEmployeeApi({
                type: debouncedSearchBarType as "name" | "id" | "phone",
                role: "Nurse",
                value: debouncedSearchBarValue
            })

            if (error) {
                setIsLoading(false);
                notification.error({
                    message: error
                })
                return;
            }

            const employees = data?.employees;

            if (!employees?.length) {
                setIsLoading(false);
                return;
            }

            const nurseOptions = generateNurseOptions(employees);

            setSearchNurseOptions(nurseOptions);

            setIsLoading(false);
        }

        searchEmployee();

    }, [debouncedSearchBarType, debouncedSearchBarValue])

    return <div className="w-full flex flex-col gap-4">
        <div className="font-bold">
            Caretaker:
        </div>
        <div className="flex w-full gap-4">
            <Form.Item
                label="Type"
                name="search_type"
                className="min-w-[130px]"
                initialValue={searchBarState.type}
                rules={[{ required: true, message: 'Please select a search type' }]}
            >
                <Select onSelect={onTypeSelect} className="min-w-[110px]" defaultValue={searchBarState.type} options={EMPLOYEE_SEARCH_TYPE} />
            </Form.Item>
            <Form.Item
                label="Take care by nurse: "
                name="care_taker_form" // Add the name prop to connect with the form field
                initialValue={nurseInCareTakers()?.id}
                className="w-[calc(100%-130px)]"
                rules={[{ required: true, message: 'Please select a nurse to take care of this patient' }]}
            >
                <Select
                    className="w-full"
                    options={searchNurseOptions}
                    showSearch
                    onSearch={(value) => {
                        setSearchBarState(prevSearchBarState => {
                            return {
                                ...prevSearchBarState,
                                value: value
                            }
                        })

                    }}
                    onSelect={(value) => onNurseSelect(value)}
                    filterOption={searchBarState.type == "name" ? filterOption : false}
                    loading={isLoading}
                />
            </Form.Item>
        </div>
    </div>

}