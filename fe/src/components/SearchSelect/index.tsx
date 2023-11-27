import { ISearchBarProps, ISearchSelectProps } from "@/common/interfaces/search/patient-search.interface"
import { Input, Select } from "antd"
import { FC } from "react"

export const SearchSelect: FC<ISearchSelectProps> = ({ value, type, selectedValue, typeOptions, valueOptions, placeholder, setSearchBarInfo, setSelectedOption }) => {
    const onSelect = (value: string) => {
        setSearchBarInfo(prevSearchInfo => {
            return {
                ...prevSearchInfo,
                type: value
            }
        })
    }

    const onSearch = (value: string) => {
        setSearchBarInfo(prevSearchInfo => {
            return {
                ...prevSearchInfo,
                value
            }
        })
    }

    const filterOptions = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    const onSelectValue = (value: string) => {
        setSelectedOption(value)
    }

    return <div className="flex gap-2 items-center justify-center w-full">
        <Select onSelect={onSelect} className="min-w-[110px]" defaultValue={type} options={typeOptions} />
        <Select className="w-[calc(100%-110px)]" value={selectedValue} options={valueOptions} onSelect={onSelectValue} onSearch={onSearch} placeholder={placeholder} filterOption={filterOptions} showSearch />
    </div>
}