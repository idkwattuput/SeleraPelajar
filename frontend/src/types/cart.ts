import { Item } from "./item";

export interface CartItem {
  quantity: number;
  note?: string;
  is_note: boolean;
  cafe_id: string;
  customer_id: string;
  item_id: string;
  item: Item;
}
