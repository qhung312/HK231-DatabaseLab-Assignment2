import { fetchPatientTestingInfoApi } from "@/apis/patient-detail.api";
import { ITestInfo } from "@/common/interfaces/form/form-detail.interface";
import { MOCK_TEST_INFO_DATA } from "@/common/mock-data/patient-test-information";
import { Col, Row, Spin, notification } from "antd";
import { FC, useEffect, useState } from "react"

export interface ITestInformationProps {
    patientId: string | number
    patientInstanceOrder: string;
}

export const TestInformation: FC<ITestInformationProps> = ({ patientId, patientInstanceOrder }) => {
    const [testInformation, setTestInformation] = useState([] as ITestInfo[]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTestInformation = async () => {
            setIsLoading(true)

            const response = await fetchPatientTestingInfoApi({
                patientId: `${patientId}`,
                patientInstanceOrder
            });

            const { data, error } = response;

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            setTestInformation(data.testInfo);
            setIsLoading(false);
        }

        fetchTestInformation();
    }, [patientId, patientInstanceOrder])

    return <div>
        <p className="font-bold mb-[20px]">Testing information</p>
        <div className="w-full flex flex-col gap-4">
            {
                !isLoading && testInformation.map((testInfo, index: number) => {
                    const { type } = testInfo;
                    const key = `${testInfo.id}_${index}`;
                    switch (type) {
                        case "PCR Test": case "Quick Test":
                            return <PcrOrQuickTest key={key} {...testInfo} />
                        case "Respiratory Rate Test": case "SPO2 Test":
                            return <RBPMOrSPO2Test key={key} {...testInfo} />
                        default:
                            return <div key={key}>Unsupported Test</div>
                    }
                })
            }
            {
                isLoading && <Spin />
            }
        </div>
    </div>
}

const PcrOrQuickTest = (props: ITestInfo) => {

    const { type, timestamp, result, ctThreshold } = props;

    const statusMapper = (result?: boolean) => result ? "text-[#FF3838]" : "text-[#2DCCFF]"

    return <Row className="border-[1px] p-6 rounded-[12px]" gutter={[16, 16]}>
        <Col span={24}>
            <div className="font-bold">
                {type}
            </div>
        </Col>

        <Col span={12}>
            <div>
                Tested on: {timestamp}
            </div>
        </Col>

        <Col span={12}>
            <div>
                Result: <span className={statusMapper(result)}>{result ? "Positive" : "Negative"}</span>
            </div>
        </Col>

        {
            result &&
            <Col span={12}>
                <div>
                    CT Threshold: {ctThreshold}
                </div>
            </Col>
        }

    </Row>
}

const RBPMOrSPO2Test = (props: ITestInfo) => {
    const { type, timestamp, ctThreshold, respiratoryBpm, spo2Rate } = props;

    const displayedResultType = type === "Respiratory Rate Test" ? "BPM" : "SPO2 Rate";

    const result = type === "Respiratory Rate Test" ? respiratoryBpm : spo2Rate;

    return <Row className="border-[1px] p-6 rounded-[12px]" gutter={[16, 16]}>
        <Col span={24}>
            <div className="font-bold">
                {type}
            </div>
        </Col>

        <Col span={12}>
            <div>
                Tested on: {timestamp}
            </div>
        </Col>

        <Col span={12}>
            <div>
                {displayedResultType}: {result}
            </div>
        </Col>
    </Row>
}