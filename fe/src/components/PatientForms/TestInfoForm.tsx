import { TEST_OPTIONS, TEST_RESULT } from "@/common/constants/add-patient-form.constant";
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { Form, Input, Row, Col, Select, Button } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { uuid } from "uuidv4";
export const TestInfoForm = () => {
    const { tests, testFunctions } = useAddPatientStore();

    const { addTestInfo, removeTestInfo, setTestInfos } = testFunctions;

    return <Row gutter={[16, 16]} className="max-w-[800px]">
        <div className="font-bold">
            Test Information:
        </div>
        <Col span={24}>
            {
                tests.map((test, index) => {
                    const { id, type, ctThreshold, spo2Rate, respiratoryBpm, result } = test;

                    const isPcrOrQuickTest = type == "PCR Test" || type == "Quick Test";

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[12px]" key={id}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Type"
                                    initialValue={type}
                                    name={`description_${id}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select a test type' }]}
                                >
                                    <Select
                                        className="min-w-[80px]"
                                        onSelect={(value) => {
                                            const newTest = {
                                                ...test,
                                                type: value
                                            }

                                            setTestInfos(newTest, index)
                                        }}
                                        value={type}
                                        options={TEST_OPTIONS}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            {
                                isPcrOrQuickTest &&
                                <>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Result"
                                            initialValue={result}
                                            name={`Result_${id}`} // Add the name prop to connect with the form field
                                            rules={[{ required: true, message: 'Please enter the test result' }]}
                                        >
                                            <Select
                                                className="min-w-[80px]"
                                                onSelect={(value) => {
                                                    const newTest = {
                                                        ...test,
                                                        result: value
                                                    }

                                                    setTestInfos(newTest, index)
                                                }}
                                                value={result}
                                                options={TEST_RESULT}
                                            />
                                        </Form.Item>
                                    </Col>
                                    {
                                        result &&
                                        <Col span={12}>
                                            <Form.Item
                                                label="CT threshold"
                                                initialValue={ctThreshold}
                                                name={`ct_threshold_${id}`} // Add the name prop to connect with the form field
                                                rules={[
                                                    { required: true, message: 'Please enter the CT threshold result' },
                                                    () => ({
                                                        validator(_, value) {
                                                            const num = Number(value);
                                                            if (!isNaN(num) && num > 0)
                                                                return Promise.resolve();
                                                            else
                                                                return Promise.reject(
                                                                    new Error('CT threshold must be greater than 0')
                                                                );
                                                        },
                                                    })
                                                ]}
                                            >
                                                <Input
                                                    type="text"
                                                    value={ctThreshold}
                                                    onChange={(e) => {
                                                        const newTest = {
                                                            ...test,
                                                            ctThreshold: Number(e.target.value)
                                                        }

                                                        setTestInfos(newTest, index)
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    }
                                </>
                            }
                            {
                                !isPcrOrQuickTest && <Col span={12}>
                                    <Form.Item
                                        label={type == "SPO2 Test" ? "SPO2" : "Respiratory BPM"}
                                        initialValue={type == "SPO2 Test" ? spo2Rate : respiratoryBpm}
                                        name={`${type == "SPO2 Test" ? "spo2" : "rbpm"}_${id}`} // Add the name prop to connect with the form field
                                        rules={[
                                            { required: true, message: `Please enter the ${type == "SPO2 Test" ? "SPO2 rate" : "Respiratory BPM"}` },
                                            () => ({
                                                validator(_, value) {
                                                    const num = Number(value);
                                                    if (type == "SPO2 Test" && !isNaN(num) && num > 0 && num <= 1) {
                                                        return Promise.resolve();
                                                    }
                                                    else if (type == "Respiratory Rate Test" && !isNaN(num) && num > 0)
                                                        return Promise.resolve();
                                                    else
                                                        return Promise.reject(
                                                            new Error(`Invalid value for ${type}`)
                                                        );
                                                },
                                            })
                                        ]}
                                    >
                                        <Input
                                            type="text"
                                            value={type == "SPO2 Test" ? spo2Rate : respiratoryBpm}
                                            onChange={(e) => {
                                                const isSPO2Test = type == "SPO2 Test";

                                                const newTest = {
                                                    ...test,
                                                    [isSPO2Test ? "spo2Rate" : "respiratoryBpm"]: Number(e.target.value)
                                                }

                                                setTestInfos(newTest, index)
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        <Button onClick={() => removeTestInfo(index)} className="flex items-center justify-center" type="primary" danger={true}>
                            <DeleteOutlined />
                        </Button>
                    </div>
                })
            }
            <Row
                className="flex items-start justify-start w-max hover:cursor-pointer  mb-[24px]"
                gutter={[16, 16]}
            >
                <div
                    onClick={() => addTestInfo({
                        id: uuid(),
                        type: "SPO2 Test",
                    })}
                    className="underline"><PlusOutlined />Add test information</div>
            </Row>
        </Col>
    </Row>
}