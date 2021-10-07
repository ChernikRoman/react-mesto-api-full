const jsonwebtoken = require('jsonwebtoken');
const AuthError = require('./authError');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    // eslint-disable-next-line no-unused-vars
    payload = jsonwebtoken.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');
  } catch (err) {
    return next(new AuthError('Неверный логичн или пароль'));
  }

  req.user = payload;

  next();
};
