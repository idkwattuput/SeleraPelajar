import { Item } from "./item";

export interface Cart {
  total_price: string;
  status: "ACTIVE" | "ORDERED";
  customer_id: string;
  cafe_id: string;
  CartItems: CartItem[];
}

export interface CartItem {
  quantity: number;
  note?: string;
  is_note: boolean;
  cafe_id: string;
  customer_id: string;
  item_id: string;
  item: Item;
}
