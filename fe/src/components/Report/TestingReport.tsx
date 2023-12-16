import { formatDate } from "@/common/helper/date";
import { ITestInfo } from "@/common/interfaces/form/form-detail.interface";
import { MOCK_TEST_INFO_DATA } from "@/common/mock-data/patient-test-information";
import { Col, Row, Spin } from "antd";
import { FC, useEffect, useState } from "react"

export interface ITestingReportProps {
    testInformation: ITestInfo[]
}

export const TestingReport: FC<ITestingReportProps> = ({ testInformation }) => {
    if (!testInformation?.length) return <div>No test information</div>

    return <div>
        <div className="w-full flex flex-col gap-4 p-2">
            {
                (testInformation || []).map((testInfo, index: number) => {
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
        </div>
    </div>
}

const PcrOrQuickTest = (props: ITestInfo) => {

    const { type, timestamp, result, ctThreshold } = props;

    const statusMapper = (result?: boolean) => result ? "text-[#2DCCFF]" : "text-[#FF3838]"

    return <Row className="border-[1px] p-4 rounded-[12px]" gutter={[16, 16]}>
        <Col span={24}>
            <div className="font-bold">
                {type}
            </div>
        </Col>

        <Col span={12}>
            <div>
                Tested on: {formatDate(timestamp || 'true', true)}
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
    const { type, timestamp, respiratoryBpm, spo2Rate } = props;

    const displayedResultType = type === "Respiratory Rate Test" ? "BPM" : "SPO2 Rate";

    const result = type === "Respiratory Rate Test" ? respiratoryBpm : spo2Rate;

    return <Row className="border-[1px] p-4 rounded-[12px]" gutter={[16, 16]}>
        <Col span={24}>
            <div className="font-bold">
                {type}
            </div>
        </Col>

        <Col span={12}>
            <div>
            Tested on: {formatDate(timestamp || 'true', true)}
            </div>
        </Col>

        <Col span={12}>
            <div>
                {displayedResultType}: {result}
            </div>
        </Col>
    </Row>
}