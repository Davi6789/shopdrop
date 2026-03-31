// frontend/src/pages/OrderSuccess.tsx

interface Props {
  orderId: number;
  onBackToShop: () => void;
}

export default function OrderSuccess({ orderId, onBackToShop }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Bestellung erfolgreich!
        </h1>
        <p className="text-gray-500 mb-1">Deine Bestellnummer:</p>
        <p className="text-3xl font-bold text-green-600 mb-6">#{orderId}</p>
        <p className="text-gray-400 text-sm mb-8">
          Deine Pflanzen sind auf dem Weg zu dir 🚚
        </p>
        <button
          onClick={onBackToShop}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          Zurück zum Shop
        </button>
      </div>
    </div>
  );
}