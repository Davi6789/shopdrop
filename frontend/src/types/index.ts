// src/types/index.ts

export interface Product{
  id: number;
  name: string;
  description: string;
  price: string | number;
  image_url: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
