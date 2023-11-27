import useAddPatientStore from "@/hooks/useAddPatientStore";
import { Button, Col, Form, Input, Row, Select, notification } from "antd"
import { DeleteOutlined } from "@ant-design/icons";
import { uuid } from "uuidv4";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { generateSymptomsOptions } from "@/common/helper/generate-options";
import { MOCK_SYMPTOMS_DATA } from "@/common/mock-data/form-search-result";
import { fetchSymptomsApi } from "@/apis";
import useAddInstaceStore from "@/hooks/useAddInstanceStore";

export const SymptomForm = () => {
    const { symptoms, symptomFunctions } = useAddInstaceStore();
    const [symptomsOptions, setSymptomsOptions] = useState([] as any);

    const { addSymptomInfo, removeSymptomInfo, setSymptomInfos } = symptomFunctions;

    const handleSymptomChange = (value: string | number, field: "description" | "seriousness" | "symptomId", index: number) => {
        const newSymptom = {
            ...symptoms[index],
            [field]: value,
        }

        setSymptomInfos(newSymptom, index);
    };

    useEffect(() => {
        const fetchSymptoms = async () => {
            const response = await fetchSymptomsApi();
            const { data, error } = response;

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            const { symptoms } = data || {};
            setSymptomsOptions(generateSymptomsOptions(symptoms || []))
        }

        fetchSymptoms();
    }, [])

    const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    return <Row gutter={[16, 16]} className="max-w-[800px]">

        <div className="font-bold">
            Symptoms:
        </div>
        <Col span={24}>
            {
                symptoms.map((symptom, index) => {
                    const { id, seriousness, symptomId } = symptom

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[12px]" key={id}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    initialValue={symptomId}
                                    name={`symptom_description_${id}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select a description' }]}
                                >
                                    <Select
                                        options={symptomsOptions}
                                        defaultValue={symptomId}
                                        onSelect={(value) => handleSymptomChange(value, 'symptomId', index)}
                                        filterOption={filterOption}
                                        showSearch
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
                        symptomId: "",
                        description: "",
                        seriousness: ""
                    })}

                    className="underline"><PlusOutlined />Add symptom</div>
            </Row>
        </Col>
    </Row>
}