import { IPeriodInfo } from "@/common/interfaces/form/form-detail.interface";
import { Col, Row } from "antd";
import { FC } from "react";

export interface IPeriodReportProps {
    periods?: IPeriodInfo[];
}
export const PeriodReport: FC<IPeriodReportProps> = ({ periods }) => {
    if (!periods?.length) return <div>No reported periods</div>

    return <div>
        <div className="w-full flex flex-col gap-4">
            {
                (periods || []).map((period, index: number) => {

                    const { startDate, endDate, seriousness, periodId } = period

                    return <div className="border-[1px] p-4 rounded-[12px]" key={periodId}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <p>Start date: <span>{startDate}</span></p>
                            </Col>
                            <Col span={12}>
                                <p>End date: <span>{endDate}</span></p>
                            </Col>

                            <Col span={24}>
                                <p>Seriousness: <span>{seriousness}</span></p>
                            </Col>
                        </Row>
                    </div>
                })
            }
        </div>
    </div>
}