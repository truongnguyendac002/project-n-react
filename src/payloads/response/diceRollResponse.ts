import { UUID } from "crypto";
export interface DiceRollResponse {
    id: UUID,
    points: number,
    questId: UUID,
    rollAt: string
}
