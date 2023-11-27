import { Dispatch, SetStateAction } from "react"

export interface ISearchBarProps {
    value: string,
    type: string,
    options: {
        label: string,
        value: string,
    }[],
    placeholder?: string;
    setSearchBarInfo: Dispatch<SetStateAction<SearchBarState>>
}

export interface ISearchSelectProps {
    value: string,
    selectedValue?: string,
    type: string,
    typeOptions: {
        label: string,
        value: string,
    }[],
    valueOptions: {
        label: string,
        value: string,
    }[],
    placeholder?: string;
    setSearchBarInfo: Dispatch<SetStateAction<SearchBarState>>;
    setSelectedOption: Dispatch<SetStateAction<string>>;
}

export type SearchBarState = Omit<ISearchBarProps, 'setSearchBarInfo' | 'options' | 'placeholder'>


export interface IPatientComorbidity {
    description: string,
    seriousness: string,
}
export interface IPatientSearchResult {
    id: string,
    name: string,
    phone: string,
    comorbidities: IPatientComorbidity[],
}


export interface IPatientSearchResultProps {
    patientSearchResults: IPatientSearchResult[],
}