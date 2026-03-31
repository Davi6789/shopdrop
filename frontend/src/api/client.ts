// frontend/src/api/client.ts

const BASE_URL = 'http://localhost:3001';

export async function getProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error('Fehler beim Laden der Produkte');
  return response.json();
}

export async function getProduct(id: number) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Produkt nicht gefunden');
  return response.json();
}

export async function postOrder(data: {
  customer_name: string;
  customer_address: string;
  items: { product_id: number; quantity: number }[];
}) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Bestellung fehlgeschlagen');
  return response.json();
}