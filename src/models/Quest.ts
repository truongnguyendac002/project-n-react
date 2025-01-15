import { UUID } from "crypto";
import { Dayjs } from "dayjs";

export interface IQuest {
    key: UUID;
    target: string;
    description: string;
    isDone: boolean;
    points: number;
    forDate: Dayjs;
}
