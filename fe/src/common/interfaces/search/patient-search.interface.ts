import { Dispatch, SetStateAction } from "react"

export interface IPatientSearchProps {
    value: string,
    type: string,
    setPatientSearchInfo: Dispatch<SetStateAction<IPatientSearchState>>
}

export type IPatientSearchState = Omit<IPatientSearchProps, 'setPatientSearchInfo'>