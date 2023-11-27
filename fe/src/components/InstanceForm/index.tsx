import { Button, Form, notification } from "antd"
import { TestInfoForm } from "./TestInfoForm"
import { TreatmentForm } from "./TreatmentForm"
import { SymptomForm } from "./SymptomForm"
import { useForm } from "antd/es/form/Form"
import useAddPatientStore from "@/hooks/useAddPatientStore"
import { addInstanceApi, addPatientApi } from "@/apis"
import { useRouter } from "next/navigation"
import { FC, useEffect } from "react"
import { CareTakerForm } from "./CareTakerForm"
import { LocationBeforeAdmissionForm } from "./LocationForm"
import useAddInstaceStore from "@/hooks/useAddInstanceStore"

export interface InstaceFormProps {
    patientId?: string;
}

export const InstanceForm: FC<InstaceFormProps> = ({ patientId }) => {
    const [form] = useForm();
    const { getAddInstancePayload, resetAddPatientForm } = useAddInstaceStore()

    const router = useRouter();

    const onAddPatient = async () => {
        try {
            await form.validateFields()
                .catch((err) => {
                    throw new Error(err);
                })
        }
        catch (err) {
            notification.error({
                message: "Please fill in all required fields"
            })
            return;
        }



        notification.open({
            message: `Adding information for new patient`,
        })
        if (!patientId) return;

        const payload = {
            ...getAddInstancePayload(),
            patientId
        }

        const response = await addInstanceApi(payload)

        const { data, error } = response;

        if (error) {
            notification.error({
                message: error
            })
            return;
        }

        if (!data) {
            notification.error({
                message: "Add instance failed"
            })
            return;
        }

        if (!data.success) {
            notification.error({
                message: "Add instance failed"
            })
            return;
        }

        notification.success({
            message: "Add instance successfully"
        })

        resetAddPatientForm();
        router.push(`/patient/${data.patientId}`)
    }

    useEffect(() => {
        resetAddPatientForm();
    }, [])

    if (!patientId) return <></>;

    return <div className="w-full p-6 border-[1px] gap-6 flex-col rounded-[8px] flex items-center justify-center">
        <Form form={form} layout="vertical" >
            <LocationBeforeAdmissionForm />
            <CareTakerForm />
            <SymptomForm />
            <TestInfoForm />
            <TreatmentForm />
            <Button type="primary" htmlType="submit" onClick={onAddPatient}>
                Add admission
            </Button>
        </Form>
    </div>
}