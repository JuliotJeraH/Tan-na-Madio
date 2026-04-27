const assert = require('assert');
const auth = require('../src/controllers/authController');

(async () => {
  assert.equal(typeof auth.login, 'function');
  assert.equal(typeof auth.register, 'function');

  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; }
  };
  const req = { body: { email: 'test@example.com', password: 'secret' } };

  await auth.register(req, res);
  assert(res.body && res.body.message, 'register should return a message');

  await auth.login(req, res);
  assert(res.body && res.body.message, 'login should return a message');

  console.log('auth tests passed');
})();
