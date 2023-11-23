import { searchEmployeeApi } from "@/apis";
import { IEmployeeBriefInfo } from "@/apis/interfaces/employee-detail.interface";
import { temporaryFilter } from "@/common/helper/filter";
import { Col, Row, Spin, notification } from "antd";
import { FC, useEffect, useState } from "react";
export interface IEmployeeCardProps {
    employeeId: string;
    role?: 'Doctor' | 'Nurse' | 'Staff' | 'Volunteer' | 'Manager'
}
export const EmployeeCard: FC<IEmployeeCardProps> = ({ employeeId, role }) => {

    const [employeeInfo, setEmployeeInfo] = useState<IEmployeeBriefInfo>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!employeeId) return;

        setIsLoading(true);
        const fetchEmployeeInfo = async () => {
            const { data, error } = await searchEmployeeApi({
                type: "id",
                value: employeeId,
                role
            })

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            const employees = data?.employees;

            if (!employees?.length) {
                notification.error({
                    message: "Employee not found"
                })
                return;
            }

            const employee = temporaryFilter(employeeId, employees)// used when there has yet to be a true search api

            setEmployeeInfo(employee);
            setIsLoading(false);
        }

        fetchEmployeeInfo();
    }, [employeeId])

    return <Row gutter={[16, 16]}>
        {
            employeeInfo && !isLoading &&
            <>
                <Col span={12}>
                    <div>
                        Full name: {employeeInfo.name}
                    </div>
                </Col>

                <Col span={12}>
                    <div>
                        Phone: {employeeInfo.phone}
                    </div>
                </Col>

                <Col span={12}>
                    <div>
                        Employee ID: {employeeInfo.employeeId}
                    </div>
                </Col>

                <Col span={12}>
                    <div>
                        Role: {employeeInfo.role}
                    </div>
                </Col>

            </>
        }
        {
            isLoading && <Spin />
        }
    </Row >
}