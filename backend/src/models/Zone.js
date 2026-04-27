module.exports = {
  tableName: 'zones',
  createTableSQL: `
    CREATE TABLE IF NOT EXISTS zones (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      geom GEOMETRY
    );
  `
};
