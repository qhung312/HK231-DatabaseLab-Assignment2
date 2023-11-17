import { IMedicationFormProps } from "@/common/interfaces/form/form-detail.interface"
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { FC } from "react"
import { uuid } from "uuidv4";
import { MedicationEffectForm } from "./MedicationEffectsForm";

export const MedicationForm: FC<IMedicationFormProps> = ({
    medications,
    treatmentIndex
}) => {
    const { addMedicationInfo, setMedicationInfos, removeMedicationInfo } = useAddPatientStore();
    return <div className="border-[1px] p-4 rounded-[8px] mb-[24px]">
        <div className="font-bold">
            Medications
        </div>
        <>
            {
                medications.map((medication, medIndex) => {
                    const { medId, medName, exp, price, effects } = medication;

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[24px]" key={medId}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Medication name:"
                                    initialValue={medName}
                                    name={`med_name_id_${medId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter medication name' }]}
                                >
                                    <Input
                                        type="text"
                                        value={medName}
                                        placeholder="Medication name"
                                        onChange={(e) => {
                                            const newMed = {
                                                ...medication,
                                                medName: e.target.value
                                            }

                                            setMedicationInfos(newMed, medIndex, treatmentIndex)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Expiry date:"
                                    initialValue={exp}
                                    name={`exp_date_${medId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter medication expiry date' }]}
                                >
                                    <Input
                                        type="text"
                                        value={exp}
                                        placeholder="mm/dd/yyyy"
                                        onChange={(e) => {
                                            const newMed = {
                                                ...medication,
                                                exp: e.target.value
                                            }

                                            setMedicationInfos(newMed, medIndex, treatmentIndex)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Medication price:"
                                    initialValue={price}
                                    name={`med_price_${medId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter medication price' }]}
                                >
                                    <Input
                                        type="text"
                                        value={price}
                                        placeholder="mm/dd/yyyy"
                                        onChange={(e) => {
                                            const newMed = {
                                                ...medication,
                                                price: e.target.value
                                            }

                                            setMedicationInfos(newMed, medIndex, treatmentIndex)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <MedicationEffectForm medicationIndex={medIndex} treatmentIndex={treatmentIndex} medicationEffects={effects} />
                        <Button onClick={() => removeMedicationInfo(medIndex, treatmentIndex)} className="flex items-center justify-center" type="primary" danger={true}>
                            <DeleteOutlined />
                        </Button>
                    </div>
                })
            }
        </>
        <Row
            className="flex items-start justify-start w-max hover:cursor-pointer"
            gutter={[16, 16]}
        >
            <div
                onClick={() => addMedicationInfo(
                    {
                        medId: uuid(),
                        medName: "",
                        exp: "",
                        price: "0",
                        effects: []
                    },
                    treatmentIndex
                )}
                className="underline"><PlusOutlined />Add medication information</div>
        </Row >
    </div >
}