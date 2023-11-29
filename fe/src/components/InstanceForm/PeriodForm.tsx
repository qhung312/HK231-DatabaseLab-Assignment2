import { IPeriodInfo } from "@/common/interfaces/form/form-detail.interface";
import { Row } from "antd";
import { FC } from "react";
import { PeriodDetail } from "./PeriodDetail";
import { PlusOutlined } from "@ant-design/icons";
import useAddPatientStore from "@/hooks/useAddPatientStore";
import useAddInstaceStore from "@/hooks/useAddInstanceStore";

export interface IPeriodFormProps {
    symptomIndex: number;
    periods?: IPeriodInfo[];
}

export const PeriodForm: FC<IPeriodFormProps> = ({
    symptomIndex,
    periods
}) => {
    const { periodFunctions } = useAddInstaceStore()
    const { addNewPeriod } = periodFunctions;

    return <Row gutter={[16, 0]}>
        {
            periods?.length ? <div className="w-full flex flex-col p-2 -mt-[8px]">
                {
                    periods.map((period, periodIndex) => {
                        return <PeriodDetail
                            key={period.periodId}
                            periodIndex={periodIndex}
                            periodInfo={period}
                            symptomIndex={symptomIndex}
                        />
                    })
                }
            </div>
                : <></>
        }
        <div
            onClick={() => addNewPeriod(symptomIndex)}
            className="underline hover:cursor-pointer -mt-[8px]">
            <PlusOutlined />Add more detail for this symptom
        </div>
    </Row>
}