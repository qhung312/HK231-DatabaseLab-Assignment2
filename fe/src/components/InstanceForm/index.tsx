import { Button, Form, notification } from "antd"
import { TestInfoForm } from "./TestInfoForm"
import { TreatmentForm } from "./TreatmentForm"
import { SymptomForm } from "./SymptomForm"
import { useForm } from "antd/es/form/Form"
import useAddPatientStore from "@/hooks/useAddPatientStore"
import { addPatientApi } from "@/apis"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CareTakerForm } from "./CareTakerForm"
import { LocationBeforeAdmissionForm } from "./LocationForm"

export const PatientForms = () => {
    const [form] = useForm();
    const { getAddPatientPayload, resetAddPatientForm } = useAddPatientStore()

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

        const payload = getAddPatientPayload();
        console.log(payload)

        notification.open({
            message: `Adding information for new patient`,
        })

        const response = await addPatientApi(payload);

        const { data, error } = response;

        if (error) {
            notification.error({
                message: error
            })
            return;
        }

        if (!data) {
            notification.error({
                message: "Add patient failed"
            })
            return;
        }

        if (!data.success) {
            notification.error({
                message: "Add patient failed"
            })
            return;
        }

        notification.success({
            message: "Add patient successfully"
        })

        resetAddPatientForm();
        router.push(`/patient/${data.patientId}`)
    }

    useEffect(() => {
        resetAddPatientForm();
    }, [])

    return <Form form={form} layout="vertical" >
        <LocationBeforeAdmissionForm />
        <CareTakerForm />
        <SymptomForm />
        <TestInfoForm />
        <TreatmentForm />
        <Button type="primary" htmlType="submit" onClick={onAddPatient}>
            Add patient
        </Button>
    </Form>
}