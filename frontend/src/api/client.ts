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
   },
  token?: string | null
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Bestellung fehlgeschlagen');
  }
    return response.json();
  }
 /* { */

/*   // 1. Token aus dem Speicher holen
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // 2. Den Token als "Authorization" Header mitschicken
      'Authorization': token ? `Bearer ${token}` : '' 
    },
    body: JSON.stringify(data),
  });
 */