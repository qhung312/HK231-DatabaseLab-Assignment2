import { Button, Form } from "antd"
import { DemographicForm } from "./DemographicForm"
import { ComorbidityForm } from "./ComorbidityForm"
import { TestInfoForm } from "./TestInfoForm"

export const AddPatientForm = () => {
    return <Form layout="vertical" >
        <DemographicForm />
        <ComorbidityForm />
        <TestInfoForm />
        <Button type="primary" htmlType="submit">
            Add patient
        </Button>
    </Form>
}