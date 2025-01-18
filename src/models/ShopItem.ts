import { UUID } from "crypto";
export enum ShopItemStatus {
    ACTIVE = "ACTIVE",
    SOLD_OUT = "SOLD_OUT",
    INACTIVE = "INACTIVE",
}

export interface IShopItem {
    id: UUID;
    name: string;
    imageUrl: string;
    description: string;
    price: number;
    status: ShopItemStatus
}