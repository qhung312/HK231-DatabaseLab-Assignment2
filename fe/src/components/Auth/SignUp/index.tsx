import { FC, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Card, notification, Spin } from 'antd';
import { useRouter } from "next/navigation";
import { signUpApi } from "@/apis";
import { useSessionStore } from "@/hooks";

const SignUpComponent: FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);



    const onFinish = async (values: any) => {
        const payload = {
            username: values.username,
            password: values.password,
            employeeId: values.employeeID
        }

        setIsLoading(true)

        try {
            const { data, error } = await signUpApi(payload)

            if (error) {
                notification.error({
                    message: error
                })
                return;
            }

            notification.success({
                message: data?.message || 'Sign up successfully'
            })

            router.push('/signin');
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setIsLoading(false)
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
        employeeID?: string;
    };

    return (
        <Card title="Sign up">
            <Form
                className="w-[250px] sm:w-[500px] flex flex-col items-center justify-center"
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Employee ID"
                    name="employeeID"
                    rules={[{ required: true, message: 'Please enter your employee ID!' }]}
                    className="w-full"
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                    className="w-full"
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                    className="w-full"
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button disabled={isLoading} type="primary" htmlType="submit">
                        Sign up
                    </Button>
                    {
                        isLoading && <Spin />
                    }
                </Form.Item>
            </Form>
        </Card>
    )
}

export default SignUpComponent;