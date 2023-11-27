'use client'
import { searchPatientApi } from "@/apis"
import { fetchPatientDemographicInfoApi } from "@/apis/patient-detail.api"
import { PATIENT_SEARCH_TYPE } from "@/common/constants/patient-search.constant"
import { IDemographicInfo } from "@/common/interfaces/form/form-detail.interface"
import { IPatientSearchResult, SearchBarState } from "@/common/interfaces/search/patient-search.interface"
import { InstanceForm } from "@/components/InstanceForm"
import { SearchBar } from "@/components/SearchBar"
import { SearchSelect } from "@/components/SearchSelect"
import withAuth from "@/hocs/WithAuth"
import { useDebounce } from "@/hooks"
import { Col, Row, Spin, notification } from "antd"
import { useEffect, useState } from "react"

const AddInstancePage = () => {
    const [patientSearchInfo, setPatientSearchInfo] = useState<SearchBarState>({
        type: PATIENT_SEARCH_TYPE[0].value,
        value: ''
    })

    const [demographicInfo, setDemographicInfo] = useState({} as IDemographicInfo)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedPatient, setSelectedPatient] = useState<string>("")

    const [patientOptions, setPatientOptions] = useState<{
        value: string;
        label: string;
    }[]>([])

    const debouncedValue = useDebounce(patientSearchInfo.value, 400)
    const debouncedType = useDebounce(patientSearchInfo.type, 200)

    useEffect(() => {
        // TODO: Call API
        const generatePatientOptions = (data: IPatientSearchResult[]) => {
            const options = data.map(patient => {
                return {
                    value: patient.id,
                    label: patient.name
                }
            })
            setPatientOptions(options)
        }

        const fetchPatientSearchResults = async () => {
            setIsLoading(true)
            const { data, error } = await searchPatientApi({
                type: debouncedType as "name" | "phone" | "id",
                value: debouncedValue
            })

            if (error) {
                notification.error({
                    message: error
                })
                setIsLoading(false)
                return
            }
            if (!data) return

            generatePatientOptions(data as IPatientSearchResult[])
            setIsLoading(false)
        }

        if (!debouncedValue || !debouncedType) return;

        try {
            setIsLoading(true);
            fetchPatientSearchResults()
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }, [debouncedValue, debouncedType])

    useEffect(() => {
        if (!selectedPatient) return;

        const fetchDemographicInfo = async () => {
            setIsLoading(true);

            // Mock api call
            const { error, data } = await fetchPatientDemographicInfoApi({
                patientId: selectedPatient || ""
            });

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            if (!data?.demographicInfo)
                return;

            const demographicInfo = data.demographicInfo;

            setDemographicInfo(demographicInfo);
            setIsLoading(false)
        }

        fetchDemographicInfo();
    }, [selectedPatient])

    return (
        <div className="w-full flex flex-col gap-4">
            <SearchSelect
                value={patientSearchInfo.value}
                type={patientSearchInfo.type}
                selectedValue={selectedPatient}
                typeOptions={PATIENT_SEARCH_TYPE}
                valueOptions={patientOptions}
                setSelectedOption={setSelectedPatient}
                placeholder={`Enter patient's ${patientSearchInfo.type == "phone" ? "phone number" : patientSearchInfo.type}`}
                setSearchBarInfo={setPatientSearchInfo}
            />
            {
                isLoading &&
                <Spin />
            }

            {
                !isLoading && selectedPatient &&

                <Row className="mb-[20px]" gutter={[16, 16]}>
                    <Col span={24} className="font-bold">Patient information</Col>
                    <Col span={12}>
                        <p>Full name: <span>{demographicInfo.name}</span></p>
                    </Col>

                    <Col span={12}>
                        <p>Gender: <span>{demographicInfo.gender}</span></p>
                    </Col>

                    <Col span={12}>
                        <p>ID: <span>{demographicInfo.id}</span></p>
                    </Col>

                    <Col span={12} >
                        <p>Phone: <span>{demographicInfo.phone}</span></p>
                    </Col>

                    <Col span={24}>
                        <p>Address: <span>{demographicInfo.address}</span></p>
                    </Col>
                </Row>

            }

            <InstanceForm patientId={selectedPatient} />

        </div>
    )
}

export default withAuth(AddInstancePage)