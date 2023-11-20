import useAddPatientStore from "@/hooks/useAddPatientStore";
import { Button, Col, Form, Input, Row } from "antd"
import { DeleteOutlined } from "@ant-design/icons";
import { uuid } from "uuidv4";
import { PlusOutlined } from "@ant-design/icons";

export const SymptomForm = () => {
    const { symptoms, symptomFunctions } = useAddPatientStore();

    const { addSymptomInfo, removeSymptomInfo, setSymptomInfos } = symptomFunctions;

    const handleSymptomChange = (value: string, field: "description" | "seriousness", index: number) => {
        const newSymptom = {
            ...symptoms[index],
            [field]: value,
        }

        setSymptomInfos(newSymptom, index);
    };

    return <Row gutter={[16, 16]} className="max-w-[800px]">

        <div className="font-bold">
            Symptoms:
        </div>
        <Col span={24}>
            {
                symptoms.map((symptom, index) => {
                    const { id, description, seriousness } = symptom

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[12px]" key={id}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    initialValue={description}
                                    name={`symptom_description_${id}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter a description' }]}
                                >
                                    <Input
                                        type="text"
                                        value={description}
                                        onChange={(e) => handleSymptomChange(e.target.value, 'description', index)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Seriousness"
                                    initialValue={seriousness}
                                    name={`symptom_seriousness_${id}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter the seriousness status' }]}
                                >
                                    <Input
                                        type="text"
                                        value={seriousness}
                                        onChange={(e) => handleSymptomChange(e.target.value, 'seriousness', index)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button onClick={() => removeSymptomInfo(index)} className="flex items-center justify-center" type="primary" danger={true}>
                            <DeleteOutlined />
                        </Button>
                    </div>
                })
            }
            <Row
                className="flex items-start justify-start w-max hover:cursor-pointer mb-[24px]"
                gutter={[16, 16]}
            >
                <div
                    onClick={() => addSymptomInfo({
                        id: uuid(),
                        description: "",
                        seriousness: ""
                    })}

                    className="underline"><PlusOutlined />Add symptom</div>
            </Row>
        </Col>
    </Row>
}