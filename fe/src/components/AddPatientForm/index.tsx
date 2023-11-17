import { Button, Form } from "antd"
import { DemographicForm } from "./DemographicForm"
import { ComorbidityForm } from "./ComorbidityForm"
import { TestInfoForm } from "./TestInfoForm"
import { TreatmentForm } from "./TreatmentForm"

export const AddPatientForm = () => {
    return <Form layout="vertical" >
        <DemographicForm />
        <ComorbidityForm />
        <TestInfoForm />
        <TreatmentForm />
        <Button type="primary" htmlType="submit">
            Add patient
        </Button>
    </Form>
}