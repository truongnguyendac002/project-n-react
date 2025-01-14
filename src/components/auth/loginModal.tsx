import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import RegisterModal from "./registerModal";
import { fetchUserInfo, login } from "../../services/authService";
import { DataResponse } from "../../payloads/response/dataResponse";
import { LoginRequest } from "../../payloads/request/loginRequest";
import { removeUserProfile, setUserProfile } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../redux/reduxHook";

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
            const response: DataResponse = await login(values);
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
            console.log("Login failed. Please try again." + error);
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Modal
                title={"Login"}
                open={visible}
                onCancel={onCancel}
                footer={null}
                centered
                width={400}
            >
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

                <div className="text-center -mt-4 text-sm text-gray-500">
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
