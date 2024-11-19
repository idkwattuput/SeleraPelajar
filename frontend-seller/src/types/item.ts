export interface Item {
  id: string;
  name: string;
  description?: string;
  price: string;
  image: string;
  is_available: boolean;
  cafe_id: string;
  category_id: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
}
