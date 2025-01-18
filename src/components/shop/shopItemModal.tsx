import { Form, Input, InputNumber, message, Modal } from "antd";
import { IShopItem } from "../../models/ShopItem";
import { useEffect } from "react";
import { UUID } from "crypto";
import { ShopItemRequest } from "../../payloads/request/shopItemRequest";
import { createShopItem, updateShopItem } from "../../services/shopService";

interface ItemModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (quest: IShopItem) => void;
    editingItem?: IShopItem;
}

const ShopItemModal: React.FC<ItemModalProps> = ({ visible, onCancel, onSave, editingItem }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (editingItem) {
                form.setFieldsValue({
                    name: editingItem.name,
                    description: editingItem.description,
                    price: editingItem.price,
                    imageUrl: editingItem.imageUrl,
                });
            }
            else {
                form.resetFields();
            }
        }
    }, [visible, editingItem, form]);

    const handleSave = () => {
        const handleCreate = async () => {
            try {
                const values = await form.validateFields();
                const item: ShopItemRequest = {
                    name: values.name,
                    description: values.description,
                    price: values.price,
                };
                const response = await createShopItem(item);
                if (response.respCode === "000") {
                    message.success("Create item successfully!");
                    onSave(response.data as IShopItem);
                }
                else {
                    console.error("Failed to create item: ", response.data);
                }
            }
            catch (error) {
                console.error("Server error: ", error);
            }
        }
        const handleUpdate = async () => {
            try {
                const values = await form.validateFields();
                const item: ShopItemRequest = {
                    id: editingItem?.id as UUID,
                    name: values.name,
                    description: values.description,
                    price: values.price,
                };
                const response = await updateShopItem(editingItem?.id as UUID, item);
                if (response.respCode === "000") {
                    message.success("Update item successfully!");
                    onSave(response.data as IShopItem);
                }
                else {
                    console.error("Failed to update item: ", response.data);
                }
            }
            catch (error) {
                console.error("Server error: ", error);
            }
        }
        if (editingItem) {
            handleUpdate();
        }
        else {
            handleCreate();
        }
    }

    return (
        <Modal
            open={visible}
            title={editingItem ? "Edit item" : "Add new item"}
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleSave}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please input the price of item!" }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please input the name of item!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please input the description of item!" }]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default ShopItemModal;
