'use client';
import { IPatientInstance } from "@/apis/interfaces/patient-detail.interface";
import { fetchPatientDemographicInfoApi, fetchPatientInstanceApi } from "@/apis/patient-detail.api";
import { IDemographicInfo } from "@/common/interfaces/form/form-detail.interface";
import { EmployeeCard } from "@/components/Card/EmployeeCard";
import { PatientReport } from "@/components/Report";
import { TestInformation } from "@/components/TestInformation";
import withAuth from "@/hocs/WithAuth"
import { ContainerOutlined, PieChartOutlined } from "@ant-design/icons";
import { Col, Collapse, Menu, MenuProps, Row, Select, Spin, notification } from "antd";
import { ReactNode, useEffect, useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type
    } as MenuItem;
}


export enum ViewsEnum {
    test = "test",
    report = "report"
}

const items: MenuItem[] = [
    getItem("Report", ViewsEnum.report, <ContainerOutlined />),
    getItem("Test information", ViewsEnum.test, <PieChartOutlined />),
];

const SELECTED_VIEWS: Record<ViewsEnum, (patientId: string, patientInstanceOrder: string) => ReactNode> = {
    [ViewsEnum.test]: (patientId, patientInstanceOrder) => <TestInformation patientId={patientId} patientInstanceOrder={patientInstanceOrder} />,
    [ViewsEnum.report]: (patientId, patientInstanceOrder) => <PatientReport patientId={patientId} patientInstanceOrder={patientInstanceOrder} />
};

const PatientDetail = ({ params }: {
    params?: {
        id: string
    }
}) => {
    const [selectedViews, setSelectedViews] = useState(ViewsEnum.report)
    const [demographicInformation, setDemographicInformation] = useState({} as IDemographicInfo);
    const [selectedPatientInstance, setSelectedPatientInstance] = useState<IPatientInstance>();

    const [isLoading, setIsLoading] = useState(false);

    const [patientInstanceOptions, setPatientInstanceOptions] = useState([] as {
        label: string,
        value: string | number,
        [key: string]: any;
    }[]);

    const generatePatientInstanceOptions = (instanceInfo: IPatientInstance[]) => {
        const lastAdmissionIndex = instanceInfo.length - 1;

        return instanceInfo.map((instance, index) => {

            let label = `${instance.patientOrder}. ${instance.admissionTime}`;

            if (index == lastAdmissionIndex) {
                label += " (Latest)";
            }

            return {
                label,
                value: instance.patientOrder,
                ...instance
            }
        })
    }

    const setSelectedInstanceOrder = (value: string | number) => {
        const selectedInstance = patientInstanceOptions.find((instance) => instance.patientOrder == value);

        setSelectedPatientInstance(selectedInstance as any);
    }

    useEffect(() => {
        const fetchDemographicInfo = async () => {
            setIsLoading(true);

            // Mock api call
            const { error, data } = await fetchPatientDemographicInfoApi({
                patientId: params?.id || ""
            });

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            if (!data?.demographicInfo)
                return;

            const demographicInfo = data.demographicInfo;

            setDemographicInformation(demographicInfo);

            await fetchPatientInstace();
        }

        const fetchPatientInstace = async () => {
            const { error, data } = await fetchPatientInstanceApi({
                patientId: params?.id || ""
            });

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            if (!data?.instanceInfo)
                return;

            const instanceInfo = data.instanceInfo;
            const patientInstanceOptions = generatePatientInstanceOptions(instanceInfo);

            const lastOptionIndex = patientInstanceOptions.length - 1;
            setSelectedPatientInstance(patientInstanceOptions[lastOptionIndex]);

            setPatientInstanceOptions(patientInstanceOptions);
            setIsLoading(false);
        }

        fetchDemographicInfo();
    }, [])

    const statusMapper = (result?: boolean) => result ? "text-[#FF3838]" : "text-[#2DCCFF]"

    return (
        <div className="flex flex-row w-full gap-4">
            <Menu
                defaultSelectedKeys={[selectedViews]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                className="border-[1px] rounded-[12px] w-[15%]"
                items={items}
                onSelect={(item) => setSelectedViews(item.key as ViewsEnum)}
            />
            <div className="flex flex-col w-[85%] p-8 border-[1px] rounded-[12px]">
                <p className="font-bold mb-[20px]">Patient information</p>
                {
                    isLoading ?
                        <Spin /> :
                        <Row className="mb-[20px]" gutter={[16, 16]}>
                            <Col span={12}>
                                <p>Full name: <span>{demographicInformation.name}</span></p>
                            </Col>

                            <Col span={12}>
                                <p>Gender: <span>{demographicInformation.gender}</span></p>
                            </Col>

                            <Col span={12}>
                                <p>ID: <span>{demographicInformation.id}</span></p>
                            </Col>

                            <Col span={12} >
                                <p>Phone: <span>{demographicInformation.phone}</span></p>
                            </Col>

                            <Col span={24}>
                                <p>Address: <span>{demographicInformation.address}</span></p>
                            </Col>
                        </Row>
                }
                {
                    !isLoading &&
                    <div className="flex flex-col gap-4 mb-[20px]">
                        <p className="font-bold">Patient admissions</p>
                        <Col span={12} >
                            <Select
                                className="min-w-[300px]"
                                defaultValue={selectedPatientInstance?.patientOrder}
                                options={patientInstanceOptions}
                                loading={isLoading}
                                disabled={isLoading}
                                onSelect={(value) => setSelectedInstanceOrder(`${value}`)}
                            />
                        </Col>
                    </div>
                }

                {selectedPatientInstance?.patientOrder &&
                    <Row className="mb-[20px]" gutter={[16, 16]}>
                        <Col span={12}>
                            <p>Admitted on: <span>{selectedPatientInstance?.admissionTime}</span></p>
                        </Col>

                        <Col span={12}>
                            <p>Status: <span className={statusMapper(selectedPatientInstance?.isWarning)}>{selectedPatientInstance?.isWarning ? "Warning" : "Normal"}</span></p>
                        </Col>

                        <Col span={24}>
                            <p>Location before admission: <span>{selectedPatientInstance?.locationBeforeAdmission || "not mentioned"}</span></p>
                        </Col>
                        <Col span={12}>
                            <Collapse
                                items={[
                                    {
                                        key: 'Nurse information',
                                        label: <p className="font-bold">Nurse information</p>,
                                        children: <EmployeeCard employeeId={selectedPatientInstance.assignedNurseId} role="Nurse" />
                                    }
                                ]}
                            />
                        </Col>
                    </Row>
                }
                {
                    selectedPatientInstance?.patientOrder && SELECTED_VIEWS[selectedViews](params?.id || "", `${selectedPatientInstance?.patientOrder}`)
                }
            </div>
        </div>
    )
}

export default withAuth(PatientDetail);