import { FC, useState } from "react";
import { Button, Checkbox, Form, Input, Card, notification, Spin } from 'antd';
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/hooks";
import { fetchUserSession } from "@/apis";

const LogInComponent: FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { setUserSession } = useSessionStore();

    const onFinish = async (values: any) => {
        const payload = {
            username: values.username,
            password: values.password
        }

        setIsLoading(true)

        try {
            const { userInfo, error } = await fetchUserSession(payload)

            if (error || !userInfo) {
                notification.error({
                    message: error || "Missing user information"
                })
                return;
            }

            notification.success({
                message: 'Log in successfully'
            })

            setUserSession(userInfo);
            router.back();
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
    };


    return (
        <Card title="Log in">
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button disabled={isLoading} type="primary" htmlType="submit">
                        Log in
                    </Button>
                    {
                        isLoading && <Spin />
                    }
                </Form.Item>
            </Form>
        </Card>
    )
}

export default LogInComponent;