import { ITreatmenInfo } from "@/common/interfaces/form/form-detail.interface"
import { Col, Collapse, Divider, Input, Row } from "antd";
import { FC } from "react";
import { MedicationsReport } from "./MedicationReport";
import { EmployeeCard } from "../Card/EmployeeCard";

export interface ITreatmentReportProps {
    treatments: ITreatmenInfo[];
}

export const TreatmentReport: FC<ITreatmentReportProps> = ({ treatments }) => {
    if (!treatments?.length) return <div>No treatment</div>

    const isLastChild = (index: number) => index === treatments.length - 1
    return <div className="w-full flex flex-col gap-4 border-[1px] rounded-[12px] p-6">
        {
            (treatments || []).map((treatment, index) => {
                const { startDate, endDate, result, medications, treatmentId } = treatment

                const pluralMedString = medications?.length > 1 ? "s" : ""

                const key = `${treatmentId}_${index}`
                return <Row key={key} gutter={[16, 16]} >
                    <Col span={12}>
                        <div>
                            Start Date: {startDate}
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            End Date: {endDate}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div>
                            <span className="font-bold">Result:</span> {result}
                        </div>
                    </Col>
                    {
                        <Collapse
                            items={[
                                {
                                    key: 'Nurse information',
                                    label: <p className="font-bold">Doctor information</p>,
                                    children: <EmployeeCard employeeId={treatment.doctorId} role="Doctor" />
                                },
                                {
                                    key: 'medications',
                                    label: <p className="font-bold">Medication{pluralMedString} used</p>,
                                    children: <MedicationsReport medications={medications} />
                                }
                            ]}
                        />
                    }
                    {
                        !isLastChild(index) &&
                        <Divider />
                    }
                </Row>
            })
        }
    </div>
}