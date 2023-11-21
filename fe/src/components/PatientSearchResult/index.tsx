import { IPatientSearchResultProps } from "@/common/interfaces/search/patient-search.interface";
import { Button, Col, Collapse, Divider, Row } from "antd";
import { FC } from "react";
import { LinkOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Comorbidity } from "./Comorbidity";
export const PatientSearchResult: FC<IPatientSearchResultProps> = ({ patientSearchResults }) => {
    const router = useRouter();

    const resultCount = patientSearchResults.length;

    const onViewReport = (id: string) => {
        router.push(`/patient/${id}`)
    }

    return (
        <div className="w-full items-start justify-center flex flex-col gap-2">
            <p className="text-sm">Found {resultCount} result<span>{resultCount > 1 ? "s" : ""}:</span></p>
            <div className="w-full flex flex-col gap-2">
                {
                    patientSearchResults.map((patient) => {
                        const { name, phone, comorbidities, id } = patient
                        return (
                            <Row className="w-full text-[14px] border-[1px] border-[#f0f0f0] p-6 rounded-[8px] flex flex-col sm:flex-row gap-4" key={id}>
                                <Col className="flex flex-col gap-1">
                                    <p>Name: <span className="font-bold">{name}</span></p>
                                    <p>Phone number: {phone}</p>
                                    <Button onClick={() => onViewReport(id)} type="primary" className="mt-4 flex items-center justify-center">View report <LinkOutlined /></Button>
                                </Col>
                                {
                                    comorbidities?.length &&
                                    <Col className="h-[90px] hidden sm:inline">
                                        <Divider className="h-full" type="vertical" />
                                    </Col>
                                }
                                {
                                    comorbidities?.length &&
                                    <Col className="flex flex-col gap-4">
                                        <Collapse items={[
                                            {
                                                key: 'Comorbidities',
                                                label: 'Comorbidities',
                                                children: <Comorbidity comorbidities={comorbidities} />
                                            }
                                        ]} />
                                    </Col>
                                }
                            </Row>
                        )
                    })
                }
            </div>
        </div>
    );
}