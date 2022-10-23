DROP TABLE IF EXISTS listings CASCADE;
DROP TYPE IF EXISTS categories;
CREATE TYPE categories AS ENUM ('Farming', 'Lighting', 'Misc', 'Food');
CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category categories,
  sold_status BOOLEAN DEFAULT false,
  active_status VARCHAR(10) DEFAULT 'active'
);
