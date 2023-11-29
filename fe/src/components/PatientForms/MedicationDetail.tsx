import { IMedicationInfo } from "@/common/interfaces/form/form-detail.interface"
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { Button, Col, Divider, Form, Row, Select, notification } from "antd";
import { FC, useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useDebounce } from "@/hooks";
import { generateMedicationOptions } from "@/common/helper/generate-options";
import { MOCK_MEDICATION_DATA } from "@/common/mock-data/form-search-result";
import { fetchMedicationApi } from "@/apis";

export interface IMedicationDetailProps {
    medication: IMedicationInfo;
    medIndex: number;
    treatmentIndex: number;
}

export const MedicationDetail: FC<IMedicationDetailProps> = ({
    medication,
    medIndex,
    treatmentIndex
}) => {
    const { treatmentFunctions } = useAddPatientStore();
    const { removeMedicationInfo, setMedicationInfos } = treatmentFunctions;

    const { medId, medName, expiredDate, price, effects, id } = medication;

    const [text, setText] = useState(`${medId}` || "");
    const debouncedValue = useDebounce(text, 500);

    const [medicationOptions, setMedicationOptions] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            // Mock api call
            const response = await fetchMedicationApi({
                medId: debouncedValue
            });

            const { data, error } = response;

            if (error) {
                notification.error({
                    message: error
                })
                setIsLoading(false)
                return;
            }

            if (!data?.medications) {
                notification.error({
                    message: "Cannot find medication"
                })
                setIsLoading(false)
                return;
            }
            const { medications } = data;

            const options = generateMedicationOptions(medications)
            setMedicationOptions(options)

            setIsLoading(false)
        }

        fetchData();
    }, [debouncedValue])

    const selectedMedicationMetadata = (medId: string) => {
        const medicationMetadata = medicationOptions.find((med: any) => med.value === medId)

        if (!medicationMetadata)
            return;

        const newMed = {
            ...medication,
            ...medicationMetadata
        }

        return newMed;
    }

    return <div className="border-[1px] p-4 rounded-[8px] mb-[24px]" key={medId}>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form.Item
                    label="Medication ID:"
                    initialValue={medId}
                    name={`med_name_id_${id}`} // Add the name prop to connect with the form field
                    rules={[{ required: true, message: 'Please select medication id' }]}
                >
                    <Select
                        placeholder="Medication id"
                        onSelect={(value) => {
                            const newMed = {
                                ...medication,
                                medId: value,
                                ...selectedMedicationMetadata(value)
                            }

                            setMedicationInfos(newMed, medIndex, treatmentIndex)
                        }}
                        options={medicationOptions}
                        loading={isLoading}
                        onSearch={(value) => setText(value)}
                        showSearch
                    />
                </Form.Item>
            </Col>
        </Row>
        {
            medId &&
            <Row className="mb-[20px]" gutter={[16, 16]}>
                <Col span={24}>
                    <div>
                        Medication name: <span className="font-bold">{medName}</span>
                    </div>
                </Col>
                <Col span={12}>
                    <div>
                        Price: <span className="font-bold">{price}</span>
                    </div>
                </Col>
                <Col span={12}>
                    <div>
                        Expire on: <span className="font-bold">{expiredDate}</span>
                    </div>
                </Col>
                <Divider />
                {
                    effects?.length > 0 &&
                    <Col span={24}>
                        <div>
                            Effect{effects?.length > 1 ? "s" : ""}:
                        </div>
                    </Col>
                }
                {
                    effects?.length > 0 &&
                    effects.map((effect, index) => {
                        return <Col span={24} key={`${effect.medEffectId}_${index}`}>
                            <div>
                                - <span className="font-bold">{effect.medEffect}</span>
                            </div>
                        </Col>
                    })
                }
            </Row>
        }
        <Button onClick={() => removeMedicationInfo(medIndex, treatmentIndex)} className="flex items-center justify-center" type="primary" danger={true}>
            <DeleteOutlined />
        </Button>
    </div>
}