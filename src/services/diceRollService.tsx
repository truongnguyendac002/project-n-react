import { IQuest } from "../models/Quest"
import { DataResponse } from "../payloads/response/dataResponse"
import { DiceRollResponse } from "../payloads/response/diceRollResponse";
import axiosInstance from "../ultils/axiosInstance";
import { Dayjs } from "dayjs";

export const rollDice = async (quest: IQuest, totalScore:number): Promise<DataResponse<DiceRollResponse>> => {
    try {
        const response = await axiosInstance.post(`/diceRoll/${quest.key}?diceNumber=${totalScore}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to roll dice' + error);
    }
}

export const getTotalPointsAtDate = async (date: Dayjs): Promise<DataResponse<number>> => {
    try {
        const response = await axiosInstance.get(`/diceRoll/total?date=${date.format('DD-MM-YYYY')}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get rolls at date' + error);
    }
}