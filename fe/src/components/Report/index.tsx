import { FC, useEffect, useState } from "react"
import { SymptomReport } from "./SymptomReport";
import { Collapse, Spin, notification } from "antd";
import { ComorbidityReport } from "./ComorbidityReport";
import { TestingReport } from "./TestingReport";
import { TreatmentReport } from "./TreatmentReport";
import { IReportInfoData } from "@/apis/interfaces/patient-detail.interface";
import { fetchReportInfoApi } from "@/apis/patient-detail.api";

export interface IReportProps {
    patientId: string | number
    patientInstanceOrder: string;
}


export const PatientReport: FC<IReportProps> = ({ patientId, patientInstanceOrder }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [reportInfo, setReport] = useState<IReportInfoData>({
        symptomsInfo: [],
        comorbidityInfo: [],
        testInfo: [],
        treatmentInfo: []
    });

    useEffect(() => {
        const fetchReportInfo = async () => {
            setIsLoading(true)

            const response = await fetchReportInfoApi({
                patientId: `${patientId}`,
                patientInstanceOrder
            })

            const { data, error } = response;

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            if (!data?.reportInfo) return;

            setReport(data.reportInfo);
            setIsLoading(false);
        }

        fetchReportInfo();
    }, [patientId, patientInstanceOrder])

    return <>
        {
            isLoading && <Spin />
        }
        <p className="font-bold mb-[20px]">Report</p>
        {
            !isLoading &&
            <Collapse
                items={
                    [
                        {
                            key: 'Symptoms',
                            label: <p className="font-bold">Symptoms</p>,
                            children: <SymptomReport symptoms={reportInfo.symptomsInfo} />
                        },
                        {
                            key: 'Comorbidity',
                            label: <p className="font-bold">Comorbidities</p>,
                            children: <ComorbidityReport comorbidities={reportInfo.comorbidityInfo} />
                        },
                        {
                            key: 'Tests',
                            label: <p className="font-bold">Tests</p>,
                            children: <TestingReport testInformation={reportInfo.testInfo} />
                        },
                        {
                            key: 'Treatments',
                            label: <p className="font-bold">Treatments</p>,
                            children: <TreatmentReport treatments={reportInfo.treatmentInfo} />
                        }
                    ]
                }
            />
        }
    </>
}