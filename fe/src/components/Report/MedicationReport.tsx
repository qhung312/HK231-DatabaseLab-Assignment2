import { IMedicationInfo } from "@/common/interfaces/form/form-detail.interface"
import { Col, Divider, Row } from "antd"
import { FC } from "react"

export interface IMedicationReportProps {
    medications: IMedicationInfo[]
}
export const MedicationsReport: FC<IMedicationReportProps> = ({
    medications
}) => {
    if (!medications?.length) return <div>No medication</div>

    return <div>
        <div className="w-full flex flex-col gap-4">
            {
                medications.map((medication, index: number) => {

                    const { id, medName, expiredDate, price, effects, medId } = medication
                    const key = `${medId}_${id}`

                    return <div className="border-[1px] p-4 rounded-[12px]" key={key}>
                        <Row className="mb-[20px]" gutter={[16, 16]}>
                            <Col span={24}>
                                <div>
                                    Medication ID: <span className="font-bold">{medId}</span>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div>
                                    Medication name: <span className="font-bold">{medName}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div>
                                    Price: <span className="font-bold">{price}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div>
                                    Expire on: <span className="font-bold">{expiredDate}</span>
                                </div>
                            </Col>
                            <Divider />
                            {
                                effects?.length > 0 &&
                                <Col span={24}>
                                    <div>
                                        Effect{effects?.length > 1 ? "s" : ""}:
                                    </div>
                                </Col>
                            }
                            {
                                effects?.length > 0 &&
                                effects.map((effect, index) => {
                                    return <Col span={24} key={`${effect.medEffectId}_${index}`}>
                                        <div>
                                            - <span className="font-bold">{effect.medEffect}</span>
                                        </div>
                                    </Col>
                                })
                            }
                        </Row>
                    </div>
                })
            }
        </div>
    </div>
}