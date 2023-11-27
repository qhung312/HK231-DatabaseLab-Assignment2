import useAddInstaceStore from "@/hooks/useAddInstanceStore";
import useAddPatientStore from "@/hooks/useAddPatientStore"
import { Col, Form, Input, InputNumber, Row } from "antd"

export const LocationBeforeAdmissionForm = () => {
    const { locationBeforeAdmission, setLocation } = useAddInstaceStore();

    return <Row gutter={[16, 16]} className="max-w-[800px]">
        <Col span={24}>
            <Form.Item
                label="Location before admission"
                initialValue={locationBeforeAdmission}
                name="location_before)_admission" // Add the name prop to connect with the form field
                rules={[{ required: true, message: 'Please enter a name' }]}
            >
                <Input
                    type="text"
                    value={locationBeforeAdmission}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </Form.Item>
        </Col>
    </Row>
}