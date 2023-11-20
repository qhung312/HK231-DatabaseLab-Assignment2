'use client';
import { IDemographicInfo } from "@/common/interfaces/form/form-detail.interface";
import { MOCK_TEST_DEMOGRAPHIC_DATA } from "@/common/mock-data/patient-test-information";
import { TestInformation } from "@/components/TestInformation";
import withAuth from "@/hocs/WithAuth"
import { ContainerOutlined, PieChartOutlined } from "@ant-design/icons";
import { Col, Menu, MenuProps, Row } from "antd";
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

const SELECTED_VIEWS: Record<ViewsEnum, (patientId: string) => ReactNode> = {
    [ViewsEnum.test]: (patientId) => <TestInformation patientId={patientId} />,
    [ViewsEnum.report]: () => <></>
};




const PatientDetail = ({ params }: {
    params?: {
        id: string
    }
}) => {
    const [selectedViews, setSelectedViews] = useState(ViewsEnum.report)
    const [demographicInformation, setDemographicInformation] = useState({} as IDemographicInfo);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDemographicInfo = async () => {
            setIsLoading(true);
            // Mock api call
            return await new Promise(() => {
                setTimeout(() => {
                    setDemographicInformation(MOCK_TEST_DEMOGRAPHIC_DATA)
                }, 500)
            })
        }

        fetchDemographicInfo();
    }, [])

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
                {
                    SELECTED_VIEWS[selectedViews](params?.id || "")
                }
            </div>
        </div>
    )
}

export default withAuth(PatientDetail);