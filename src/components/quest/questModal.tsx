// src/components/QuestModal.tsx
import React, { useEffect } from "react";
import { Modal, Input, Form } from "antd";
import { IQuest } from "../../models/Quest";
import { Dayjs } from "dayjs";
import { QuestRequest } from "../../payloads/request/questRequest";
import { createQuest, updateQuest } from "../../services/questService";

interface QuestModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (quest: IQuest) => void;
    selectedDate: Dayjs;
    editingQuest?: IQuest;
}

const QuestModal: React.FC<QuestModalProps> = ({ visible, onCancel, onSave, selectedDate, editingQuest }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (editingQuest) {
                form.setFieldsValue({
                    target: editingQuest.target,
                    description: editingQuest.description,
                    points: editingQuest.points,
                });
            }
            else {
                form.resetFields();
            }
        }
    }, [visible, editingQuest, form]);

    const handleSave = () => {
        const handleCreate = async () => {
            try {
                const values = await form.validateFields();
                const questRequest: QuestRequest = {
                    id: null,
                    target: values.target,
                    description: values.description,
                    forDate: selectedDate.format('DD-MM-YYYY'),
                    isDone: false,
                };
                const response = await createQuest(questRequest)
                if (response.respCode === "000") {
                    const newQuest: IQuest = response.data;
                    onSave(newQuest);
                } else {
                    console.error("Failed to create quest: ", response.data);
                }
            }
            catch (error) {
                console.error("Server error: ", error);
            }
        }
        const handleUpdate = async () => {
            try {
                const values = await form.validateFields();
                const questRequest: QuestRequest = {
                    id: editingQuest?.key as string | null,
                    target: values.target,
                    description: values.description,
                    forDate: selectedDate.format('DD-MM-YYYY'),
                    isDone: false,
                };
                const response = await updateQuest(questRequest)
                if (response.respCode === "000") {
                    const newQuest: IQuest = response.data;
                    onSave(newQuest);
                } else {
                    console.error("Failed to update quest: ", response.data);
                }
            }
            catch (error) {
                console.error("Server error: ", error);
            }
        }


        if (editingQuest) {
            handleUpdate();
        } else {
            handleCreate();
        }

    };

    return (
        <Modal
            title={editingQuest ? "Sửa Quest" : "Thêm mới Quest"}
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}
            okText={editingQuest ? "Cập nhật" : "Thêm mới"}
            cancelText="Hủy"
            width={800}  // Điều chỉnh chiều rộng modal nếu cần
            style={{ overflowY: 'auto', whiteSpace: 'nowrap' }}  // Sử dụng style thay vì modalStyle
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="target"
                    label="Mục tiêu"
                    rules={[{ required: true, message: "Vui lòng nhập mục tiêu!" }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuestModal;
