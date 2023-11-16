import { PATIENT_SEARCH_TYPE } from "@/common/constants/patient-search.constant"
import { validateInput } from "@/common/helper/validate-input"
import { IPatientSearchProps } from "@/common/interfaces/search/patient-search.interface"
import { Input, Select } from "antd"
import { FC } from "react"

export const PatientSearchBar: FC<IPatientSearchProps> = ({ value, type, setPatientSearchInfo }) => {
    const onSelect = (value: string) => {
        if (!validateInput(value, type)) return;

        setPatientSearchInfo(prevSearchInfo => {
            return {
                ...prevSearchInfo,
                type: value
            }
        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!validateInput(value, type)) return;

        setPatientSearchInfo(prevSearchInfo => {
            return {
                ...prevSearchInfo,
                value
            }
        })
    }

    const placeholder = `Enter patient's ${type == "phone" ? "phone number" : type}`

    return <div className="flex gap-2 items-center justify-center w-full">
        <Select onSelect={onSelect} className="min-w-[110px]" defaultValue={type} options={PATIENT_SEARCH_TYPE} />
        <Input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
}