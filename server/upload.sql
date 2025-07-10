CREATE TABLE upload (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  image_name TEXT NOT NULL,
  image_path TEXT NOT NULL,
  labels TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);