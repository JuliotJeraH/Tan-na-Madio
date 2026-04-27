const assert = require('assert');
const collecteModel = require('../src/models/Collecte');

(() => {
  assert(collecteModel, 'Collecte model should exist');
  assert(collecteModel.createTableSQL && collecteModel.createTableSQL.includes('CREATE TABLE'), 'Collecte.createTableSQL should contain CREATE TABLE');
  console.log('collecte tests passed');
})();
