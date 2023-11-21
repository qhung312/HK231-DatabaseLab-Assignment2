'use client'
import { PatientForms } from "@/components/PatientForms"
import withAuth from "@/hocs/WithAuth"

const AddPatientPage = () => {
    return (
        <div className="border-[1px] gap-6 flex-col rounded-[8px] p-2 flex w-full items-center justify-center">
            <PatientForms />
        </div>
    )
}

export default withAuth(AddPatientPage)