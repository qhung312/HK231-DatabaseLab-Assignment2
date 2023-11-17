import { Button, Form } from "antd"
import { DemographicForm } from "./DemographicForm"
import { ComorbidityForm } from "./ComorbidityForm"
import { TestInfoForm } from "./TestInfoForm"
import { TreatmentForm } from "./TreatmentForm"
import { SymptomForm } from "./SymptomForm"
import { useForm } from "antd/es/form/Form"
import useAddPatientStore from "@/hooks/useAddPatientStore"

export const AddPatientForm = () => {
    const [form] = useForm();
    const { getAllPatientInfo } = useAddPatientStore()
    const onAddPatient = () => {
        form.validateFields()
            .then(values => {
                const payload = getAllPatientInfo();
                // TODO: call api to save patients
                console.log(payload)
            })
    }
    return <Form form={form} layout="vertical" >
        <DemographicForm />
        <SymptomForm />
        <ComorbidityForm />
        <TestInfoForm />
        <TreatmentForm />
        <Button type="primary" htmlType="submit" onClick={onAddPatient}>
            Add patient
        </Button>
    </Form>
}