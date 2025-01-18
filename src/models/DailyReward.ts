import { UUID } from "crypto";

export interface IReward {
    id: UUID;
    name: string;
    imageUrl: string;
    description: string;
    minPoint: number;
}