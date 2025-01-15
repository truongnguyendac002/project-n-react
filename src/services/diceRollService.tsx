import { IQuest } from "../models/Quest"
import { DataResponse } from "../payloads/response/dataResponse"
import { DiceRollResponse } from "../payloads/response/diceRollResponse";
import axiosInstance from "../ultils/axiosInstance";

export const rollDice = async (quest: IQuest, totalScore:number): Promise<DataResponse<DiceRollResponse>> => {
    try {
        const response = await axiosInstance.post(`/diceRoll/${quest.key}?diceNumber=${totalScore}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to roll dice' + error);
    }
}