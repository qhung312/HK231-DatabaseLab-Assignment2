import { ISymptomInfo } from "@/common/interfaces/form/form-detail.interface"
import { FC } from "react";
import { PeriodReport } from "./PeriodReport";
import { Collapse } from "antd";

export interface ISymptomReportProps {
    symptoms: ISymptomInfo[];
}
export const SymptomReport: FC<ISymptomReportProps> = ({
    symptoms
}) => {
    if (!symptoms?.length) return <div>No symptom</div>

    return <div>
        <div className="w-full flex flex-col gap-4">
            {
                (symptoms || []).map((symptom, index: number) => {

                    const { id, description, periods, symptomId } = symptom
                    const key = `${symptomId}_${id}`

                    return <div className="flex flex-col gap-4 border-[1px] p-4 rounded-[12px]" key={key}>
                        <p>Description: <span className="font-bold">{description}</span></p>
                        <Collapse
                            items={[
                                {
                                    key: 'Periods',
                                    label: <p className="font-bold">Details</p>,
                                    children: <PeriodReport periods={periods} />
                                }
                            ]}
                        />
                    </div>
                })
            }
        </div>
    </div>
}