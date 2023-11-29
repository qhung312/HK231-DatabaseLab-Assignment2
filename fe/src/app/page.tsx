'use client'
import { PATIENT_SEARCH_TYPE } from "@/common/constants/patient-search.constant"
import { IPatientSearchResult, SearchBarState } from "@/common/interfaces/search/patient-search.interface"
import { PATIENT_SEARCH_RESULT } from "@/common/mock-data/patient-search-result"
import { SearchBar } from "@/components/SearchBar"
import { PatientSearchResult } from "@/components/PatientSearchResult"
import withAuth from "@/hocs/WithAuth"
import { useDebounce } from "@/hooks"
import { Spin, notification } from "antd"
import { useEffect, useState } from "react"
import { searchPatientApi } from "@/apis"

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

      setPatientSearchResults(data as IPatientSearchResult[]); // temporary
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
    <div className="gap-4 flex-col rounded-[8px] p-2 flex w-full items-center justify-center">
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