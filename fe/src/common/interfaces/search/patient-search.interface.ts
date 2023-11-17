import { Dispatch, SetStateAction } from "react"

export interface IPatientSearchProps {
    value: string,
    type: string,
    setPatientSearchInfo: Dispatch<SetStateAction<IPatientSearchState>>
}

export type IPatientSearchState = Omit<IPatientSearchProps, 'setPatientSearchInfo'>


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