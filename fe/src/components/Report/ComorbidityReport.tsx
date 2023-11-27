import { IComorbidityInfo } from "@/common/interfaces/form/form-detail.interface"
import { FC } from "react"

export interface IComorbidityReportProps {
    comorbidities: IComorbidityInfo[]
}

export const ComorbidityReport: FC<IComorbidityReportProps> = ({
    comorbidities
}) => {
    if (!comorbidities?.length) return <div>No comorbidity</div>

    return <div>
        <div className="w-full flex flex-col gap-4">
            {
                (comorbidities || []).map((comorbidity, index: number) => {

                    const { id, description, seriousness, comorbidityId } = comorbidity
                    const key = `${comorbidityId}_${id}`

                    return <div className="border-[1px] p-4 rounded-[12px]" key={key}>
                        <p>Description: <span className="font-bold">{description}</span></p>
                        <p>Seriousness: <span>{seriousness}</span></p>
                    </div>
                })
            }
        </div>
    </div>
}