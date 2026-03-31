// src/components/ProductCard.tsx

import type { Product } from "../types/index"; // oder './types/index'
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-green-900">{product.name}</h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-700">
            {product.price
              ? parseFloat(product.price.toString()).toFixed(2)
              : "0.00"}{" "} €
          </span>
          <span className="text-xs text-gray-400">
            {product.stock} verfügbar
          </span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition-colors duration-200">
          In den Warenkorb
        </button>
      </div>
    </div>
  );
}
