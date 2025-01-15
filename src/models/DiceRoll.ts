import { UUID } from "crypto";
import { Dayjs } from "dayjs";
import { IQuest } from "./Quest";
export interface IDiceRoll {
    id: UUID,
    points: number,
    quest: IQuest,
    rollAt: Dayjs
}
