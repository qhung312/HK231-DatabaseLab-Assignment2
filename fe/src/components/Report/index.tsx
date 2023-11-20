import { IReportInfo } from "@/common/interfaces/report/report.interface";
import { FC, useEffect, useState } from "react"
import { SymptomReport } from "./SymptomReport";
import { MOCK_PATIENT_REPORT_INFO } from "@/common/mock-data/patient-report";
import { Collapse, Spin } from "antd";
import { ComorbidityReport } from "./ComorbidityReport";
import { TestingReport } from "./TestingReport";
import { TreatmentReport } from "./TreatmentReport";

export interface IReportProps {
    patientId: string | number
}


export const PatientReport: FC<IReportProps> = ({ patientId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [reportInfo, setReport] = useState<IReportInfo>({
        symptomsInfo: [],
        comorbodityInfo: [],
        testInfo: [],
        treatmentInfo: []
    });

    useEffect(() => {
        const fetchReportInfo = async () => {
            setIsLoading(true)
            // Mock api call
            return await new Promise(() => {
                setTimeout(() => {
                    setReport(MOCK_PATIENT_REPORT_INFO);
                    setIsLoading(false);
                }, 500);
            })
        }

        fetchReportInfo();
    }, [])

    return <>
        {
            isLoading && <Spin />
        }
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
                            children: <ComorbidityReport comorbidities={reportInfo.comorbodityInfo} />
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