// frontend/src/components/ProductCard.tsx

import type { Product } from "../types/index"; // oder './types/index'
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Bild-Container mit fester Ratio */}
<div className="relative aspect-video w-full overflow-hidden bg-gray-100">
  <img
    src={product.image_url}
    alt={product.name}
    className="w-full h-full object-cover object-center" 
    onError={(e) => {
      // Falls ein Link kaputt ist, zeigt er ein Ersatzbild
      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Pflanze+kommt+bald';
    }}
  />
</div>

      {/* Content-Bereich mit flex-1, damit er den Raum füllt */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-green-900 line-clamp-1">
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-700">
            {Number(product.price).toFixed(2)} €
          </span>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
            {product.stock} auf Lager
          </span>
        </div>

        <button 
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-sm active:scale-95"
        >
          In den Warenkorb
        </button>
      </div>
    </div>
  );
}
