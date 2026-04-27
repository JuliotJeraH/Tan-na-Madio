module.exports = {
  tableName: 'camions',
  createTableSQL: `
    CREATE TABLE IF NOT EXISTS camions (
      id SERIAL PRIMARY KEY,
      plate VARCHAR(50) NOT NULL,
      capacity INTEGER DEFAULT 0
    );
  `
};
