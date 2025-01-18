import { UUID } from "crypto";
import { IShopItem } from "../models/ShopItem";
import { ShopItemRequest } from "../payloads/request/shopItemRequest";
import { DataResponse } from "../payloads/response/dataResponse";
import axiosInstance from "../ultils/axiosInstance";
import IItemPurchaseResponse from "../payloads/response/itemPurchaseResponse";

export const createShopItem = async (shopItem: ShopItemRequest): Promise<DataResponse<IShopItem | string>> => {
    try {
        const response = await axiosInstance.post('/shop', shopItem);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to createShopItem' + error);
    }
}

export const getShopItems = async (): Promise<DataResponse<IShopItem[]>> => {
    try {
        const response = await axiosInstance.get('/shop');
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to getShopItems' + error);
    }
}

export const updateShopItem = async (id: UUID, shopItem: ShopItemRequest): Promise<DataResponse<IShopItem>> => {
    try {
        const response = await axiosInstance.put(`/shop/${id}`, shopItem);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to updateShopItem' + error);
    }
}

export const deleteShopItem = async (id: UUID): Promise<DataResponse<IShopItem>> => {
    try {
        const response = await axiosInstance.delete(`/shop/${id}`);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to deleteShopItem' + error);
    }
}

export const uploadShopItemImage = async (shopItemId: UUID, file: File): Promise<DataResponse<IShopItem | string>> => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(`/shop/${shopItemId}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error("Failed to uploadShopItemImage: " + error);
    }
}

// export const deleteShopItemImage = async (shopItemId: UUID): Promise<DataResponse<string>> => {
//     try {
//         const response = await axiosInstance.delete(`/shop/${shopItemId}/image`);
//         const data: DataResponse<string> = response.data;
//         return data;
//     } catch (error) {
//         throw new Error("Failed to deleteShopItemImage: " + error);
//     }
// }

export const purchaseShopItem = async (shopItemId: UUID): Promise<DataResponse<IItemPurchaseResponse>> => {
    try {
        const response = await axiosInstance.post(`/shop/${shopItemId}/purchase`);
        const data: DataResponse<IItemPurchaseResponse> = response.data;
        return data;
    } catch (error) {
        throw new Error("Failed to purchaseShopItem: " + error);
    }
}

export const getPurchaseHistory = async (): Promise<DataResponse<IItemPurchaseResponse[]>> => {
    try {
        const response = await axiosInstance.get(`/shop/purchase-history`);
        const data: DataResponse<IItemPurchaseResponse[]> = response.data;
        return data;
    } catch (error) {
        throw new Error("Failed to getPurchaseHistory: " + error);
    }
}

