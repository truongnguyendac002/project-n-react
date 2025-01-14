import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import RegisterModal from "./registerModal";

interface LoginModalProps {
    visible: boolean;
    onCancel: () => void;
    onLogin: (values: unknown) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onCancel, onLogin }) => {
    const [registerModalVisible, setRegisterModalVisible] = useState(false);

    const onLoginFinish = (values: unknown) => {
        console.log("Login successful:", values);
        onLogin(values);
    };


    const handleRegister = (values: unknown) => {
        console.log("Registration successful:", values);
        handleRegister(values); 
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
                    onFinish={onLoginFinish}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Invalid email format!" },
                        ]}
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



                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
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
            <RegisterModal visible={registerModalVisible} onCancel={() => setRegisterModalVisible(false)} onRegister={handleRegister} />

        </>

    );
};

export default LoginModal;
