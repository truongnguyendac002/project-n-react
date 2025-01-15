import { IQuest } from "../models/Quest";
import { QuestRequest } from "../payloads/request/questRequest";
import { DataResponse } from "../payloads/response/dataResponse";
import axiosInstance from "../ultils/axiosInstance";
import { Dayjs } from "dayjs";


export const fetchQuests = async (date: Dayjs): Promise<DataResponse<IQuest>> => {
    try {
        const response = await axiosInstance.get(`/quest?date=${date.format('DD-MM-YYYY')}`);
        const data: DataResponse<IQuest> = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to fetch quests' + error);
    }
}

export const createQuest = async (request: QuestRequest): Promise<DataResponse<IQuest>> => {
    try {
        const response = await axiosInstance.post('/quest',request);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to save quest' + error);
    }
}

export const updateQuest = async (request:QuestRequest): Promise<DataResponse<IQuest>> => {
    try {
        const response = await axiosInstance.put('/quest/' + request.id,request);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to save quest' + error);
    }
}

export const deleteQuest = async (request:IQuest): Promise<DataResponse<IQuest>> => {
    try {
        const response = await axiosInstance.delete('/quest/' + request.key);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Failed to save quest' + error);
    }
}
