import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface RegisterModalProps {
    visible: boolean;
    onCancel: () => void;
    onRegister: (values: unknown) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ visible, onCancel, onRegister }) => {
    const onFinish = (values: unknown) => {
        console.log("Registration successful:", values);
        onRegister(values); // Gọi callback khi đăng ký thành công
    };

    return (
        <>
            <Modal
                title="Register"
                open={visible}
                onCancel={onCancel}
                footer={null}
                centered
                width={400}
            >
                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: "Please input your full name!" }]}
                    >
                        <Input placeholder="Enter your full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "Invalid email format!" }]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button className="" type="primary" htmlType="submit" block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default RegisterModal;
