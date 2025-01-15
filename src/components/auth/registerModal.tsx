import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { RegisterRequest } from "../../payloads/request/registerRequest";
import { DataResponse } from "../../payloads/response/dataResponse";
import { register } from "../../services/authService";
import { IUserProfile } from "../../models/user";

interface RegisterModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onCancel: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ visible, setVisible, onCancel }) => {
    const [loading, setLoading] = React.useState(false);

    const handleRegister = async (values: RegisterRequest) => {
        try {
            setLoading(true);
            const response: DataResponse<IUserProfile> = await register(values);
            if (response.respCode === "000") {
                message.success("Register successfully");
                setVisible(false);
            }
            else {
                message.error(response.respDesc);
            }
        }
        catch (error) {
            console.log("Register failed. Please try again." + error);
        }
        finally {
            setLoading(false);
        }
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
                    onFinish={handleRegister}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Full Name"
                        name="FullName"
                        rules={[{ required: true, message: "Please input your full name!" }]}
                    >
                        <Input placeholder="Enter your full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="Email"
                        rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "Invalid email format!" }]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="Password"
                        rules={[
                            { 
                                required: true, 
                                message: "Please input your password!" 
                            },
                            // {
                            //     pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/,
                            //     message: "Password must be at least 8 characters, with one uppercase letter, one lowercase letter, and one number."
                            // }
                        ]}
                                        >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="ConfirmPassword"
                        dependencies={['Password']}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('Password') === value) {
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
                        <Button loading={loading} className="" type="primary" htmlType="submit" block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default RegisterModal;
