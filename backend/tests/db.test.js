const assert = require('assert');
const fs = require('fs');

(() => {
  const sql = fs.readFileSync('src/config/schema.sql', 'utf8');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS users'), 'schema.sql should contain users table');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS collectes') || sql.includes('CREATE TABLE IF NOT EXISTS collectes'.toUpperCase()), 'schema.sql should contain collectes table');
  console.log('db tests passed');
})();
