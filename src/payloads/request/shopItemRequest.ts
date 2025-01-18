import { UUID } from "crypto";

export interface ShopItemRequest {
    id?: UUID;
    name: string;
    description: string;
    price: number;
}