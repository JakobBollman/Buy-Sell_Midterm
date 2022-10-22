DROP TABLE IF EXISTS listings CASCADE;
DROP TYPE categories;
CREATE TYPE categories AS ENUM ('Farming', 'Lighting', 'Misc', 'Food');
CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category categories,
  status VARCHAR(10) DEFAULT 'active'
);
