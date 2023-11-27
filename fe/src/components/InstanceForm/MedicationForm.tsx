import { IMedicationFormProps } from "@/common/interfaces/form/form-detail.interface"
import useAddPatientStore from "@/hooks/useAddPatientStore";
import { PlusOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { FC } from "react"
import { uuid } from "uuidv4";
import { MedicationDetail } from "./MedicationDetail";
import useAddInstaceStore from "@/hooks/useAddInstanceStore";

export const MedicationForm: FC<IMedicationFormProps> = ({
    medications,
    treatmentIndex
}) => {
    const { treatmentFunctions } = useAddInstaceStore();
    const { addMedicationInfo } = treatmentFunctions;

    return <div className="border-[1px] p-4 rounded-[8px] mb-[24px]">
        <div className="font-bold mb-[12px]">
            Medications
        </div>
        <>
            {
                medications.map((medication, medIndex) => {
                    return <MedicationDetail key={medication.id} medication={medication} medIndex={medIndex} treatmentIndex={treatmentIndex} />
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
                        id: uuid(),
                        medId: "",
                        medName: "",
                        expiredDate: "",
                        price: "0",
                        effects: []
                    },
                    treatmentIndex
                )}
                className="underline"><PlusOutlined />Add medication information</div>
        </Row >
    </div >
}