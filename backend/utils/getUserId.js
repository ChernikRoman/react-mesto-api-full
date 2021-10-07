const jsonwebtoken = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req) => {
  const token = req.cookies.jwt;
  const userId = jsonwebtoken.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key')._id;
  return userId;
};
