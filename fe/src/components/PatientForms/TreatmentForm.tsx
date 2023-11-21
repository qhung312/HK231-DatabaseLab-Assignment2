import useAddPatientStore from "@/hooks/useAddPatientStore";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select } from "antd"
import { uuid } from "uuidv4";
import { MedicationForm } from "./MedicationForm";

const { TextArea } = Input;
export const TreatmentForm = () => {
    const { treatments, treatmentFunctions } = useAddPatientStore();

    const { addTreatmentInfo, removeTreatmentInfo, setTreatmentInfos } = treatmentFunctions;

    return <Row gutter={[16, 16]} className="max-w-[800px]">
        <div className="font-bold">
            Treatment Information:
        </div>
        <Col span={24}>
            {
                treatments.map((treatment, index) => {
                    const { treatmentId, startDate, endDate, medications, result } = treatment;

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[12px]" key={treatmentId}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Start date:"
                                    initialValue={startDate}
                                    name={`start_date_${treatmentId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select enter a start date' }]}
                                >
                                    <Input
                                        type="text"
                                        value={startDate}
                                        placeholder="mm/dd/yyyy"
                                        onChange={(e) => {
                                            const newTreatment = {
                                                ...treatment,
                                                startDate: e.target.value
                                            }

                                            setTreatmentInfos(newTreatment, index)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="End date:"
                                    initialValue={endDate}
                                    name={`end${treatmentId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select enter an end date' }]}
                                >
                                    <Input
                                        type="text"
                                        value={endDate}
                                        placeholder="mm/dd/yyyy"
                                        onChange={(e) => {
                                            const newTreatment = {
                                                ...treatment,
                                                endDate: e.target.value
                                            }

                                            setTreatmentInfos(newTreatment, index)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Result:"
                                    initialValue={result}
                                    name={`treatment_result_${treatmentId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please select enter the treatment result' }]}
                                >
                                    <TextArea
                                        className="w-full"
                                        cols={24}
                                        value={result}
                                        placeholder="Enter the treatment result"
                                        onChange={(e) => {
                                            const newTreatment = {
                                                ...treatment,
                                                result: e.target.value
                                            }

                                            setTreatmentInfos(newTreatment, index)
                                        }}

                                    />
                                </Form.Item>
                                <MedicationForm medications={medications} treatmentIndex={index} />
                            </Col>
                        </Row>
                        <Button onClick={() => removeTreatmentInfo(index)} className="flex items-center justify-center" type="primary" danger={true}>
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
                    onClick={() => addTreatmentInfo({
                        treatmentId: uuid(),
                        startDate: "",
                        endDate: "",
                        medications: [],
                        result: ""
                    })}
                    className="underline"><PlusOutlined />Add treatment information</div>
            </Row>
        </Col>
    </Row>
}