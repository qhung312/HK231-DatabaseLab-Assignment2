import { IPatientComorbidity } from "@/common/interfaces/search/patient-search.interface"
import { FC } from "react"

export const Comorbidity: FC<{
    comorbidities: IPatientComorbidity[]
}> = ({ comorbidities }) => {
    return <div className="w-full flex flex-col gap-2">
        {
            comorbidities.map((comorbidity, index) => (
                <div className="flex flex-row gap-2" key={index}>
                    <div>
                        {index + 1})
                    </div>
                    <div className="flex  max-w-[150px] md:max-w-[450px] lg:max-w-[100%] flex-col gap-2">
                        <div className="break-words">Description: {comorbidity.description}</div>
                        <p>Seriousness: {comorbidity.seriousness}</p>
                    </div>
                </div>
            ))
        }
    </div>
}