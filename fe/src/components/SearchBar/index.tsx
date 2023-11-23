import { ISearchBarProps } from "@/common/interfaces/search/patient-search.interface"
import { Input, Select } from "antd"
import { FC } from "react"

export const SearchBar: FC<ISearchBarProps> = ({ value, type, options, placeholder, setSearchBarInfo }) => {
    const onSelect = (value: string) => {
        setSearchBarInfo(prevSearchInfo => {
            return {
                ...prevSearchInfo,
                type: value
            }
        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchBarInfo(prevSearchInfo => {
            return {
                ...prevSearchInfo,
                value: value
            }
        })
    }

    return <div className="flex gap-2 items-center justify-center w-full">
        <Select onSelect={onSelect} className="min-w-[110px]" defaultValue={type} options={options} />
        <Input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
}