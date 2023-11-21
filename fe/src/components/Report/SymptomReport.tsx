import { ISymptomInfo } from "@/common/interfaces/form/form-detail.interface"
import { FC } from "react";

export interface ISymptomReportProps {
    symptoms: ISymptomInfo[];
}
export const SymptomReport: FC<ISymptomReportProps> = ({
    symptoms
}) => {
    return <div>
        <div className="w-full flex flex-col gap-4">
            {
                symptoms.map((symptom, index: number) => {

                    const { id, description, seriousness, symptomId } = symptom
                    const key = `${symptomId}_${id}`

                    return <div className="border-[1px] p-4 rounded-[12px]" key={key}>
                        <p>Description: <span className="font-bold">{description}</span></p>
                        <p>Seriousness: <span>{seriousness}</span></p>
                    </div>
                })
            }
        </div>
    </div>
}