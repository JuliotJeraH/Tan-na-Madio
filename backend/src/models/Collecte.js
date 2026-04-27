module.exports = {
  tableName: 'collectes',
  createTableSQL: `
    CREATE TABLE IF NOT EXISTS collectes (
      id SERIAL PRIMARY KEY,
      zone_id INTEGER REFERENCES zones(id),
      camion_id INTEGER REFERENCES camions(id),
      scheduled_at TIMESTAMP
    );
  `
};
