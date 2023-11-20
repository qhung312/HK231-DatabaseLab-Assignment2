import useAddPatientStore from "@/hooks/useAddPatientStore";
import { Button, Col, Form, Input, Row, Select } from "antd"
import { DeleteOutlined } from "@ant-design/icons";
import { uuid } from "uuidv4";
import { PlusOutlined } from "@ant-design/icons";
import { use, useEffect, useState } from "react";
import { generateComorbiditiesOptions } from "@/common/helper/generate-options";
import { MOCK_COMORBIDITY_DATA } from "@/common/mock-data/form-search-result";

export const ComorbidityForm = () => {
    const { comorbidities, comorbidityFunctions } = useAddPatientStore();
    const [comorbiditiesOptions, setComorbiditiesOptions] = useState([] as any);

    const { addComorbidity, removeComorbidity, setComorbidities } = comorbidityFunctions;

    const handleComorbidityChange = (value: string, field: "description" | "seriousness" | "comorbidityId", index: number) => {
        const newComorbidity = {
            ...comorbidities[index],
            [field]: value,
        }

        setComorbidities(newComorbidity, index);
    };

    useEffect(() => {
        setComorbiditiesOptions(generateComorbiditiesOptions(MOCK_COMORBIDITY_DATA))
    }, [])

    const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return <Row gutter={[16, 16]} className="max-w-[800px]">

        <div className="font-bold">
            Comorbidities:
        </div>
        <Col span={24}>
            {
                comorbidities.map((comorbidity, index) => {
                    const { id, description, seriousness, comorbidityId } = comorbidity

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[12px]" key={id}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    initialValue={comorbidityId}
                                    name={`description_${id}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter a description' }]}
                                >
                                    <Select
                                        options={comorbiditiesOptions}
                                        showSearch
                                        onSelect={(value) => handleComorbidityChange(value, 'comorbidityId', index)}
                                        filterOption={filterOption}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Seriousness"
                                    initialValue={seriousness}
                                    name={`label_${id}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter the seriousness status' }]}
                                >
                                    <Input
                                        type="text"
                                        value={seriousness}
                                        onChange={(e) => handleComorbidityChange(e.target.value, 'seriousness', index)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button onClick={() => removeComorbidity(index)} className="flex items-center justify-center" type="primary" danger={true}>
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
                    onClick={() => addComorbidity({
                        id: uuid(),
                        comorbidityId: "",
                        description: "",
                        seriousness: ""
                    })}
                    className="underline"><PlusOutlined />Add comorbidity</div>
            </Row>
        </Col>
    </Row>
}