import { useEffect, useState } from "react";
import { IReward } from "../../models/DailyReward";
import { Form, Image, Input, InputNumber, message, Modal, Spin, Upload } from "antd";
import { RewardRequest } from "../../payloads/request/rewardRequest";
import { createReward, deleteRewardImage, updateReward, uploadRewardImage } from "../../services/rewardService";
import { CloseOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UUID } from "crypto";

interface rewardModalProps {
    visible: boolean;
    onCancel: (reward: IReward) => void;
    onSave: (reward: IReward) => void;
    editingReward: IReward | null; // Reward cần sửa (nếu có)
    setEditingReward: (reward: IReward | null) => void;
}

const RewardModal: React.FC<rewardModalProps> = ({ visible, onCancel, onSave, editingReward, setEditingReward }) => {
    const [form] = Form.useForm();
    const [loadingFile, setLoadingFile] = useState(false);

    useEffect(() => {
        if (visible) {
            if (editingReward) {
                form.setFieldsValue({
                    name: editingReward.name,
                    description: editingReward.description,
                    minPoint: editingReward.minPoint,
                });
            }
            else {
                form.resetFields();
            }
        }
    }, [visible, editingReward, form]);

    const handleCancel = () => {
        if (loadingFile) return;
        onCancel(editingReward as IReward);
    }

    const handleSave = () => {
        const handleCreate = async () => {
            try {
                const values = await form.validateFields();
                const rewardRequest: RewardRequest = {
                    name: values.name,
                    description: values.description,
                    minPoint: values.minPoint,
                };
                const response = await createReward(rewardRequest)
                if (response.respCode === "000") {
                    const newReward: IReward = response.data as IReward;
                    onSave(newReward);
                } else {
                    console.error("Failed to create reward: ", response.data);
                }
            }
            catch (error) {
                console.error("Server error: ", error);
            }
        }
        const handleUpdate = async () => {
            try {
                const values = await form.validateFields();
                const rewardRequest: RewardRequest = {
                    id: editingReward?.id as string | undefined,
                    name: values.name,
                    description: values.description,
                    minPoint: values.minPoint,
                };
                const response = await updateReward(rewardRequest)
                if (response.respCode === "000") {
                    const updatedReward: IReward = response.data as IReward;
                    onSave(updatedReward);
                } else {
                    console.error("Failed to update reward: ", response.data);
                }
            }
            catch (error) {
                console.error("Server error: ", error);
            }
        }
        if (loadingFile) return;
        if (editingReward) {
            handleUpdate();
        }
        else {
            handleCreate();
        }
    }

    const handleUploadImage = async (file: File) => {
        if (!editingReward || loadingFile) return;
        try {
            setLoadingFile(true);
            const response = await uploadRewardImage(editingReward.id, file);
            if (response.respCode === "000") {
                message.success("Upload image successfully!");
                const updatedReward: IReward = response.data as IReward;
                setEditingReward(updatedReward);
            }
            else {
                message.error("Failed to upload image");
            }
        }
        catch (error) {
            console.error("Server error: ", error);
        }
        finally {
            setLoadingFile(false);
        }
    }
    const handleRemoveImage = async (id: UUID) => {
        if (loadingFile) return;
        try {
            setLoadingFile(true);
            const response = await deleteRewardImage(id);
            if (response.respCode === "000") {
                message.success("Delete image successfully!");
                const updatedReward: IReward = response.data as IReward;
                setEditingReward(updatedReward);
            }
            else {
                message.error("Failed to delete image");
            }
        } catch (error) {
            console.error("Server error: ", error);
        }
        finally {
            setLoadingFile(false);
        }
    }

    return (
        <Modal
            title={editingReward ? "Sửa phần thưởng" : "Thêm phần thưởng"}
            open={visible}
            onOk={handleSave}
            onCancel={handleCancel}
            destroyOnClose
        >
            <Form form={form} layout="vertical" name="rewardForm">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Khu vực ảnh */}
                    {editingReward && (
                        <div className="md:w-1/3">
                            <Form.Item name="image" label="Hình ảnh">
                                <div className="relative flex items-center justify-center border-2 border-dashed rounded-md p-2">
                                    {editingReward.imageUrl ? (
                                        <div className="relative w-32 h-32">
                                            <Image
                                                src={editingReward.imageUrl}
                                                alt="reward"
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(editingReward?.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                {loadingFile ? (
                                                    <Spin
                                                        indicator={
                                                            <LoadingOutlined
                                                                className="text-white"
                                                                style={{ fontSize: 14 }}
                                                                spin
                                                            />
                                                        }
                                                    />
                                                ) : (
                                                    <CloseOutlined />
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <Upload
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                handleUploadImage(file);
                                                return false;
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-md">
                                                {loadingFile ? (
                                                    <Spin
                                                        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                                                    />
                                                ) : (
                                                    <PlusOutlined className="text-gray-400" />
                                                )}
                                            </div>
                                        </Upload>
                                    )}
                                </div>
                            </Form.Item>
                        </div>
                    )}

                    {/* Form nhập thông tin */}
                    <div className="flex-1">
                        <Form.Item
                            name="minPoint"
                            label="Điểm yêu cầu"
                            rules={[
                                { required: true, message: "Vui lòng nhập điểm yêu cầu!" },
                                { type: "number", min: 0, message: "Điểm phải là số không âm!" },
                                { type: "number", max: 100000, message: "Điểm không được vượt quá 100,000!" },
                            ]}
                        >
                            <InputNumber className="w-full" />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Tên phần thưởng"
                            rules={[{ required: true, message: "Vui lòng nhập tên phần thưởng!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}

export default RewardModal;