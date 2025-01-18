import { UUID } from "crypto";
import { IShopItem } from "./ShopItem";
import { Dayjs } from "dayjs";

export default interface IItemPurchase {
    id: UUID,
    shopItem: IShopItem,
    purchaseAt: Dayjs
}