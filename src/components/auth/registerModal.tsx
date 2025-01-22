import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { RegisterRequest } from "../../payloads/request/registerRequest";
import { DataResponse } from "../../payloads/response/dataResponse";
import { googleRegister, register } from "../../services/authService";
import { IUserProfile } from "../../models/User";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

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


    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const googleToken = credentialResponse.credential;
                console.log("Google Token:", googleToken);

                const response: DataResponse<string> = await googleRegister(googleToken);
                if (response.respCode === "000") {
                    message.success("Register successfully with Google!");
                    setVisible(false);
                } else {
                    message.error("Google login failed!" + response.data);
                }
            } catch (error) {
                message.error("Google login failed. Please try again.");
                console.error(error);
            }
        }
    };

    return (
        <>
            <Modal
                open={visible}
                onCancel={onCancel}
                footer={null}
                centered
                width={400}
            >
                <div className="text-center mb-7 mt-4">
                    <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                        Register an account
                    </p>
                    <p className="mt-2 text-sm leading-4 text-slate-600">
                        Register an account to use the application
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                            message.error("Google register failed. Please try again.");
                        }}
                        auto_select
                    />
                </div>
                <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                    <div className="h-px w-full bg-slate-200"></div>
                    OR
                    <div className="h-px w-full bg-slate-200"></div>
                </div>
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
