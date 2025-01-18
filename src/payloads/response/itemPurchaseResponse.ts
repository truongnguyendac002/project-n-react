import { UUID } from "crypto";


export default interface IItemPurchaseResponse {
    id: UUID,
    shop_item_id: UUID,
    purchaseAt: string
}