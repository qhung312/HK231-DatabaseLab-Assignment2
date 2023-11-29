import useAddPatientStore from "@/hooks/useAddPatientStore";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Select, notification } from "antd"
import { uuid } from "uuidv4";
import { MedicationForm } from "./MedicationForm";
import { useEffect, useState } from "react";
import { SearchBarState } from "@/common/interfaces/search/patient-search.interface";
import { EMPLOYEE_SEARCH_TYPE } from "@/common/constants/add-patient-form.constant";
import { useDebounce } from "@/hooks";
import { IEmployeeBriefInfo } from "@/apis/interfaces/employee-detail.interface";
import { searchEmployeeApi } from "@/apis";
import locale from 'antd/es/date-picker/locale/en_US';
import dayjs from "dayjs";

const { TextArea } = Input;
export const TreatmentForm = () => {
    const { treatments, treatmentFunctions } = useAddPatientStore();

    const [isLoading, setIsLoading] = useState(false);
    const [searchDoctorOptions, setSearchDoctorOptions] = useState<{
        value: string | number; // nurse id;
        label: string; // nurse name;
    }[]>([]);

    const { addTreatmentInfo, removeTreatmentInfo, setTreatmentInfos } = treatmentFunctions;

    const [searchBarState, setSearchBarState] = useState<SearchBarState>({
        type: EMPLOYEE_SEARCH_TYPE[0].value,
        value: "",
    });

    const debouncedSearchBarValue = useDebounce(searchBarState.value, 500);
    const debouncedSearchBarType = useDebounce(searchBarState.type, 500);

    const onTypeSelect = (value: string) => {
        setSearchBarState(prevSearchBarState => {
            return {
                ...prevSearchBarState,
                type: value
            }
        })
    }

    const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    const generateDoctorOptions = (doctors: IEmployeeBriefInfo[]) => {
        return doctors.map((doctor) => {
            return {
                value: doctor.employeeId,
                label: doctor.name,
            }
        })
    }

    useEffect(() => {
        const searchDoctor = async () => {
            setIsLoading(true);
            const response = await searchEmployeeApi({
                type: debouncedSearchBarType as "name" | "id" | "phone",
                value: debouncedSearchBarValue,
                role: "Doctor"
            });

            const { data, error } = response;

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            const employess = data?.employees;

            if (!employess) {
                return;
            }

            const doctorOptions = generateDoctorOptions(employess);

            setSearchDoctorOptions(doctorOptions);

            setIsLoading(false);
        }

        searchDoctor();

    }, [debouncedSearchBarType, debouncedSearchBarValue])

    return <Row gutter={[16, 16]} className="max-w-[800px]">
        <div className="font-bold">
            Treatment Information:
        </div>
        <Col span={24}>
            {
                treatments.map((treatment, index) => {
                    const { treatmentId, startDate, endDate, medications, result } = treatment;

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[12px]" key={treatmentId}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Start date:"
                                    initialValue={startDate ? dayjs(startDate, 'YYYY-MM-DD') : undefined}
                                    name={`start_date_${treatmentId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select enter a start date' }]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select start day"
                                        defaultValue={startDate ? dayjs(startDate, 'YYYY-MM-DD') : undefined}
                                        locale={locale}
                                        onChange={(_, dateString) => {
                                            const newTreatment = {
                                                ...treatment,
                                                startDate: dateString
                                            }

                                            setTreatmentInfos(newTreatment, index)
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="End date:"
                                    initialValue={endDate ? dayjs(endDate, 'DD-MM-YYYY') : undefined}
                                    name={`end_date_${treatmentId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select enter an end date' }]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select end day"
                                        defaultValue={endDate ? dayjs(endDate, 'DD-MM-YYYY') : undefined}
                                        locale={locale}
                                        onChange={(_, dateString) => {
                                            const [year, month, date] = dateString.split('-');

                                            const newTreatment = {
                                                ...treatment,
                                                endDate: dateString
                                            }
                                            console.log(newTreatment.endDate)
                                            setTreatmentInfos(newTreatment, index)
                                        }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <p>Doctor:</p>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Type"
                                    name="search_type"
                                    className="min-w-[130px]"
                                    initialValue={searchBarState.type}
                                    rules={[{ required: true, message: 'Please select a search type' }]}
                                >
                                    <Select onSelect={onTypeSelect} className="min-w-[110px]" defaultValue={searchBarState.type} options={EMPLOYEE_SEARCH_TYPE} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Doctor's name: "
                                    name={`care_taker_form_${treatmentId}`} // Add the name prop to connect with the form field
                                    initialValue={treatment.doctorId}
                                    rules={[{ required: true, message: 'Please select a doctor to take care of this patient' }]}
                                >
                                    <Select
                                        className="w-full"
                                        options={searchDoctorOptions}
                                        showSearch
                                        onSearch={(value) => {
                                            setSearchBarState(prevSearchBarState => {
                                                return {
                                                    ...prevSearchBarState,
                                                    value: value
                                                }
                                            })

                                        }}
                                        onSelect={(value) => {
                                            const newTreatment = {
                                                ...treatment,
                                                doctorId: value
                                            }

                                            setTreatmentInfos(newTreatment, index)

                                        }}
                                        filterOption={searchBarState.type == "name" ? filterOption : false}
                                        loading={isLoading}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Result:"
                                    initialValue={result}
                                    name={`treatment_result_${treatmentId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select enter the treatment result' }]}
                                >
                                    <TextArea
                                        className="w-full"
                                        cols={24}
                                        value={result}
                                        placeholder="Enter the treatment result"
                                        onChange={(e) => {
                                            const newTreatment = {
                                                ...treatment,
                                                result: e.target.value
                                            }

                                            setTreatmentInfos(newTreatment, index)
                                        }}

                                    />
                                </Form.Item>
                                <MedicationForm medications={medications} treatmentIndex={index} />
                            </Col>
                        </Row>
                        <Button onClick={() => removeTreatmentInfo(index)} className="flex items-center justify-center" type="primary" danger={true}>
                            <DeleteOutlined />
                        </Button>
                    </div>
                })
            }
            <Row
                className="flex items-start justify-start w-max hover:cursor-pointer  mb-[24px]"
                gutter={[16, 16]}
            >
                <div
                    onClick={() => addTreatmentInfo({
                        treatmentId: uuid(),
                        startDate: "",
                        endDate: "",
                        medications: [],
                        result: "",
                        doctorId: "",
                    })}
                    className="underline"><PlusOutlined />Add treatment information</div>
            </Row>
        </Col>
    </Row>
}