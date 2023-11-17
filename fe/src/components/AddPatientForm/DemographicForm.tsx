import { IDemographicFormProps } from "@/common/interfaces/form/demographic-form.interface";
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { FC } from "react";
import { Input, Select, Row, Col } from "antd";
import { GENDER_OPTIONS } from "@/common/constants/add-patient-form.constant";

export const DemographicForm: FC<IDemographicFormProps> = () => {
    const { demographic, setDemographicForm } = useAddPatientStore();

    return (
        <Row gutter={[16, 16]} className="max-w-[800px]">
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div className="flex flex-row gap-2">
                            <p className="w-[120px] text-sm">Name: </p>
                            <Input
                                type="text"
                                value={demographic.name}
                                onChange={(e) => setDemographicForm({ name: e.target.value })}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="flex items-center gap-2">
                            <p className="text-sm">Gender: </p>
                            <Select
                                className="min-w-[80px]"
                                onSelect={(value) => setDemographicForm({ gender: value })}
                                value={demographic.gender}
                                options={GENDER_OPTIONS}
                            />
                        </div>
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div className="flex flex-row gap-2">
                            <p className=" w-[120px] text-sm">ID number: </p>
                            <Input
                                type="text"
                                value={demographic.id}
                                onChange={(e) => setDemographicForm({ id: e.target.value })}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="flex items-center gap-2">
                            <p className="w-[150px] text-sm">Phone number: </p>
                            <Input
                                type="text"
                                value={demographic.phone}
                                onChange={(e) => setDemographicForm({ phone: e.target.value })}
                            />
                        </div>
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <div className="flex flex-row gap-2">
                            <p className="w-[100px] text-sm">Address: </p>
                            <Input
                                type="text"
                                value={demographic.address}
                                onChange={(e) => setDemographicForm({ address: e.target.value })}
                            />
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
