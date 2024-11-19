import { Item } from "./item";

export interface Order {
  id: string;
  total_price: string;
  status: "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED";
  customer_id: string;
  cafe_id: string;
  OrderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  note?: string;
  order_id: string;
  item_id: string;
  item: Item;
}
