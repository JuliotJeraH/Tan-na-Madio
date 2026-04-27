const assert = require('assert');
const signalement = require('../src/controllers/signalementController');

(async () => {
  assert.equal(typeof signalement.create, 'function');

  const req = { body: { description: 'Point de déchet sample' } };
  const res = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(obj) { this.body = obj; } };

  await signalement.create(req, res);
  assert(res.body && res.body.message, 'signalement.create should return a message');

  console.log('signalement tests passed');
})();
