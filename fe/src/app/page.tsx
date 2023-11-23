'use client'
import { PATIENT_SEARCH_TYPE } from "@/common/constants/patient-search.constant"
import { IPatientSearchResult, SearchBarState } from "@/common/interfaces/search/patient-search.interface"
import { PATIENT_SEARCH_RESULT } from "@/common/mock-data/patient-search-result"
import { SearchBar } from "@/components/SearchBar"
import { PatientSearchResult } from "@/components/PatientSearchResult"
import withAuth from "@/hocs/WithAuth"
import { useDebounce } from "@/hooks"
import { Spin } from "antd"
import { useEffect, useState } from "react"

const SearchPatientPage = () => {
  const [patientSearchInfo, setPatientSearchInfo] = useState<SearchBarState>({
    type: PATIENT_SEARCH_TYPE[0].value,
    value: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [patientSearchResults, setPatientSearchResults] = useState<IPatientSearchResult[] | undefined>()

  const debouncedValue = useDebounce(patientSearchInfo.value, 400)
  const debouncedType = useDebounce(patientSearchInfo.type, 200)

  useEffect(() => {
    // TODO: Call API
    const fetchPatientSearchResults = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPatientSearchResults(PATIENT_SEARCH_RESULT); // temporary
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

  return (
    <div className="border-[1px] gap-6 flex-col rounded-[8px] p-2 flex w-full items-center justify-center">
      <SearchBar
        value={patientSearchInfo.value}
        type={patientSearchInfo.type}
        options={PATIENT_SEARCH_TYPE}
        placeholder={`Enter patient's ${patientSearchInfo.type == "phone" ? "phone number" : patientSearchInfo.type}`}
        setSearchBarInfo={setPatientSearchInfo}
      />
      {
        isLoading &&
        <Spin />
      }
      {
        patientSearchResults && !isLoading &&
        <PatientSearchResult patientSearchResults={patientSearchResults} />
      }
    </div>
  )
}

export default withAuth(SearchPatientPage)