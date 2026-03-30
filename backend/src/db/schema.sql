CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  stock INT DEFAULT 0
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price_at_purchase NUMERIC(10,2) NOT NULL
);