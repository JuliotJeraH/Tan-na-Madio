// Simple request body validator placeholder
module.exports = (schema) => (req, res, next) => {
  // schema can be a function that returns an error string or null
  if (!schema) return next();
  const err = typeof schema === 'function' ? schema(req.body) : null;
  if (err) return res.status(400).json({ error: err });
  next();
};
