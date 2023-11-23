import { Dispatch, SetStateAction } from "react"

export interface ISearchBarProps {
    value: string,
    type: string,
    options: {
        label: string,
        value: string,
    }[],
    setSearchBarInfo: Dispatch<SetStateAction<SearchBarState>>
}

export type SearchBarState = Omit<ISearchBarProps, 'setSearchBarInfo' | 'options'>


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