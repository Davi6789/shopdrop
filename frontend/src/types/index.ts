// frontent/src/types/index.ts

export interface Product{
  id: number;
  name: string;
  description: string;
  price: number; // In der DB ist es oft ein String/Numeric, in TS nutzen wir number
  image_url: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
