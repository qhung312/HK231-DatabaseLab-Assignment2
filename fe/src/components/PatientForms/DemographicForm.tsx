import { IDemographicFormProps } from "@/common/interfaces/form/form-detail.interface";
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { FC } from "react";
import { Input, Select, Row, Col, Form, Button } from "antd";
import { GENDER_OPTIONS } from "@/common/constants/add-patient-form.constant";


export const DemographicForm: FC<IDemographicFormProps> = () => {
    const { demographic, setDemographicForm } = useAddPatientStore();

    
    const isFieldValid = {
        'name': (name: string) => !name.length || /^[a-zA-Z]+$/.test(name),
        'phone': (phone: string) =>  !phone.length || /^[0-9]{10}$/.test(phone),
        'id': (id: string) => !id.length || /^[0-9]+$/.test(id)
    }

    return (
        <Row gutter={[16, 16]} className="max-w-[800px]">
            <div className="font-bold">
                Information:
            </div>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            initialValue={demographic.name}
                            name="name" // Add the name prop to connect with the form field
                            rules={[{ required: true, message: 'Please enter a name' }]}
                            validateStatus={isFieldValid.name(demographic.name) ? "success" : "error"}
                            help={isFieldValid.name(demographic.name) ? "" : "Name must contain only letters"}
                        >
                            <Input
                                type="text"
                                value={demographic.name}
                                onChange={(e) => setDemographicForm({ name: e.target.value })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="gender" // Add the name prop to connect with the form field
                            label="Gender"
                            initialValue={demographic.gender}
                            rules={[{ required: true, message: 'Please select a gender' }]}
                        >
                            <Select
                                className="min-w-[80px]"
                                onSelect={(value) => setDemographicForm({ gender: value })}
                                value={demographic.gender}
                                options={GENDER_OPTIONS}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            initialValue={demographic.id}
                            label="ID number"
                            name="id" // Add the name prop to connect with the form field
                            rules={[{ required: true, message: 'Please enter an ID number' }]}
                            validateStatus={isFieldValid.id(demographic.id) ? "success" : "error"}
                            help={isFieldValid.id(demographic.id) ? "" : "ID must contain only numbers"}
                        >
                            <Input
                                type="text"
                                value={demographic.id}
                                onChange={(e) => setDemographicForm({ id: e.target.value })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phone number"
                            initialValue={demographic.phone}
                            name="phone" // Add the name prop to connect with the form field
                            rules={[{ required: true, message: 'Please enter a phone number' }]}
                            validateStatus={isFieldValid.phone(demographic.phone) ? "success" : "error"}
                            help={isFieldValid.phone(demographic.phone) ? "" : "Phone number must contain only 10 numbers"}
                        >
                            <Input
                                type="text"
                                value={demographic.phone}
                                onChange={(e) => setDemographicForm({ phone: e.target.value })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label="Address"
                            initialValue={demographic.address}
                            name="address" // Add the name prop to connect with the form field
                            rules={[{ required: true, message: 'Please enter an address' }]}
                        >
                            <Input
                                type="text"
                                value={demographic.address}
                                onChange={(e) => setDemographicForm({ address: e.target.value })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
