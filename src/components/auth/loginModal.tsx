import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import RegisterModal from "./registerModal";
import { fetchUserInfo, googleLogin, login } from "../../services/authService";
import { DataResponse } from "../../payloads/response/dataResponse";
import { LoginRequest } from "../../payloads/request/loginRequest";
import { removeUserProfile, setUserProfile } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../redux/reduxHook";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface LoginModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onCancel: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, setVisible, onCancel }) => {
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const validateToken = async () => {
        const token = localStorage.getItem('access-token');
        if (token) {
            try {
                const response = await fetchUserInfo();
                if (response.respCode === '000') {
                    dispatch(setUserProfile(response.data));
                }
                else {
                    console.log('Token failed:', response.respDesc);
                    dispatch(removeUserProfile());
                }
            } catch (error) {
                console.error('Authentication failed:', error);
                dispatch(removeUserProfile());
            }
        }
    };

    const handleLogin = async (values: LoginRequest) => {
        try {
            setLoading(true);
            const response: DataResponse<string> = await login(values);
            if (response.respCode === "000") {
                message.success("Login successfully");
                setVisible(false);
                validateToken();
            }
            else {
                message.error(response.data);
            }
        }
        catch (error) {
            message.error("Login failed. Please try again.");
            console.log("Login failed. Please try again." + error);
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

                const response: DataResponse<string> = await googleLogin(googleToken);
                if (response.respCode === "000") {
                    message.success("Login successfully with Google!");
                    setVisible(false);
                    validateToken();
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
                        Login to your account
                    </p>
                    <p className="mt-2 text-sm leading-4 text-slate-600">
                        You must be logged in to perform this action.
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                            message.error("Google login failed. Please try again.");
                        }}
                        useOneTap
                        auto_select
                        shape="rectangular"
                        theme="outline"
                        width="auto"
                    />
                </div>
                <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                    <div className="h-px w-full bg-slate-200"></div>
                    OR
                    <div className="h-px w-full bg-slate-200"></div>
                </div>
                <Form
                    name={"login"}
                    layout="vertical"
                    onFinish={handleLogin}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Email"
                        name="Email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Invalid email format!" },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="Password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" block>
                            {"Login"}
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-2 text-sm text-gray-500">
                    <>
                        Already have an account?{" "}
                        <a
                            onClick={() => setRegisterModalVisible(true)}
                            className="text-blue-500 hover:underline"
                        >
                            Register here
                        </a>
                    </>
                </div>
            </Modal>
            <RegisterModal visible={registerModalVisible} setVisible={setRegisterModalVisible} onCancel={() => setRegisterModalVisible(false)} />

        </>

    );
};

export default LoginModal;
