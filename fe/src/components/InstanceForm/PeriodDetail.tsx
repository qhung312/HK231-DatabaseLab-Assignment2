import { IPeriodInfo } from "@/common/interfaces/form/form-detail.interface";
import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { FC } from "react";
import locale from 'antd/es/date-picker/locale/en_US';
import dayjs from "dayjs";
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { DeleteOutlined } from "@ant-design/icons";
import useAddInstaceStore from "@/hooks/useAddInstanceStore";

export interface PeriodDetailProps {
    periodIndex: number;
    periodInfo: IPeriodInfo;
    symptomIndex: number;
}

export const PeriodDetail: FC<PeriodDetailProps> = ({
    periodIndex,
    periodInfo,
    symptomIndex,
}) => {
    const { startDate, endDate, seriousness, periodId } = periodInfo;

    const { periodFunctions } = useAddInstaceStore();
    const { setPeriod, removePeriod } = periodFunctions;

    const handlePeriodChange = (value: string, key: keyof IPeriodInfo) => {
        const newPeriod: IPeriodInfo = {
            ...periodInfo,
            [key]: value
        }

        setPeriod(newPeriod, periodIndex, symptomIndex)
    }

    return (
        <div className="w-full border-[1px] p-4 rounded-[8px] mb-[12px]">
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item
                        label="Start date:"
                        initialValue={startDate ? dayjs(startDate, 'YYYY-MM-DD') : undefined}
                        name={`symptom_start_date_${periodId}`} // Add the name prop to connect with the form field
                        rules={[{ required: true, message: 'Please select enter a start date' }]}
                    >
                        <DatePicker
                            className="w-full"
                            placeholder="Select start day"
                            defaultValue={startDate ? dayjs(startDate, 'YYYY-MM-DD') : undefined}
                            locale={locale}
                            onChange={(_, dateString) => handlePeriodChange(dateString, "startDate")} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="End date:"
                        initialValue={endDate ? dayjs(startDate, 'YYYY-MM-DD') : undefined}
                        name={`symptom_end_date_${periodId}`} // Add the name prop to connect with the form field
                        rules={[{ required: true, message: 'Please select enter a end date' }]}
                    >
                        <DatePicker
                            className="w-full"
                            placeholder="Select end day"
                            defaultValue={endDate ? dayjs(startDate, 'YYYY-MM-DD') : undefined}
                            locale={locale}
                            onChange={(_, dateString) => handlePeriodChange(dateString, "endDate")} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Seriousness:"
                        initialValue={seriousness}
                        name={`symptom_seriousness_${periodId}`} // Add the name prop to connect with the form field
                        rules={[{ required: true, message: 'Please enter seriousness' }]}
                    >
                        <Input
                            type="text"
                            value={seriousness}
                            placeholder="Seriousness of symptom"
                            onChange={(e) => {
                                const value = e.target.value;

                                handlePeriodChange(value, "seriousness")
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Button
                onClick={() => removePeriod(periodIndex, symptomIndex)}
                className="flex items-center justify-center] mt-[12px]"
                type="primary" danger={true}
            >
                <DeleteOutlined />
            </Button>
        </div>
    )

}