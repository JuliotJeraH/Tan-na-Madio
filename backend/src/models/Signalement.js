module.exports = {
  tableName: 'signalements',
  createTableSQL: `
    CREATE TABLE IF NOT EXISTS signalements (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      description TEXT,
      photo_path TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
};
