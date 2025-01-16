import { UUID } from "crypto";
import { IReward } from "../models/DailyReward";
import { RewardRequest } from "../payloads/request/rewardRequest";
import { DataResponse } from "../payloads/response/dataResponse";
import axiosInstance from "../ultils/axiosInstance";

export const getRewards = async (): Promise<DataResponse<IReward[] | string>> => {
    try {
        const response = await axiosInstance.get(`/reward`);
        const data: DataResponse<IReward[]> = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to getRewards' + error);
    }
};

export const createReward = async (reward: RewardRequest): Promise<DataResponse<IReward | string>> => {
    try {
        const response = await axiosInstance.post('/reward', reward);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to createReward' + error);
    }
}

export const updateReward = async (reward: RewardRequest): Promise<DataResponse<IReward | string>> => {
    try {
        const response = await axiosInstance.put(`/reward/${reward.id}`, reward);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to updateReward' + error);
    }
}

export const deleteReward = async (reward: IReward): Promise<DataResponse<IReward | string>> => {
    try {
        const response = await axiosInstance.delete(`/reward/${reward.id}`);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to deleteReward' + error);
    }
}

export const uploadRewardImage = async (rewardId: UUID, file: File): Promise<DataResponse<IReward | string>> => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(`/reward/${rewardId}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data: DataResponse<string> = response.data;
        return data;
    } catch (error) {
        throw new Error("Failed to uploadRewardImage: " + error);
    }
};

// Delete image for a reward
export const deleteRewardImage = async (rewardId: UUID): Promise<DataResponse<IReward | string>> => {
    try {
        const response = await axiosInstance.delete(`/reward/${rewardId}/image`);
        const data: DataResponse<string> = response.data;
        return data;
    } catch (error) {
        throw new Error("Failed to deleteRewardImage: " + error);
    }
};

