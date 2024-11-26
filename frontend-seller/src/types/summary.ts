import { Item } from "./item";

export interface Summary {
  order_today: number;
  revenue_today: string;
  order_week: number;
  popular_item: Item | string;
}
