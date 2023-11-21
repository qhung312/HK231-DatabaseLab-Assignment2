import { IMedicationEffectsFormProps } from "@/common/interfaces/form/form-detail.interface";
import useAddPatientStore from "@/hooks/useAddPatientStore"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { FC } from "react";
import { uuid } from "uuidv4";

export const MedicationEffectForm: FC<IMedicationEffectsFormProps> = ({
    medicationEffects,
    medicationIndex,
    treatmentIndex
}) => {
    const { treatmentFunctions } = useAddPatientStore();
    const { addMedicationEffect, removeMedicationEffect, setMedicationEffect } = treatmentFunctions;

    return <div className="border-[1px] p-4 rounded-[8px] mb-[24px]">
        <div className="font-bold">
            Medication effects:
        </div>
        <>
            {
                medicationEffects.map((effect, medEffectIndex) => {
                    const { medEffectId, medEffect } = effect;

                    return <div className="border-[1px] p-4 rounded-[8px] mb-[24px]" key={medEffectId}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    label={`Effect ${medEffectIndex + 1}:`}
                                    initialValue={medEffect}
                                    name={`med_effect_${medEffectId}`} // Add the name prop to connect with the form field
                                    rules={[{ required: true, message: 'Please enter medication effect' }]}
                                >
                                    <Input
                                        type="text"
                                        value={medEffect}
                                        placeholder="Medication name"
                                        onChange={(e) => {
                                            const newMedEffect = {
                                                ...effect,
                                                medEffect: e.target.value
                                            }

                                            setMedicationEffect(newMedEffect, medEffectIndex, medicationIndex, treatmentIndex);
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button
                            onClick={() => removeMedicationEffect(medEffectIndex, medicationIndex, treatmentIndex)}
                            className="flex items-center justify-center"
                            type="primary"
                            danger={true}
                        >
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
                onClick={() => addMedicationEffect(
                    {
                        medEffectId: uuid(),
                        medEffect: "",
                    },
                    medicationIndex,
                    treatmentIndex
                )}
                className="underline"><PlusOutlined />Add medication effects</div>
        </Row >
    </div >
}