const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const AuthError = require('../middlewares/authError');
const IncorrectRequestError = require('../middlewares/incorrectRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (validator.isEmail(email)) {
    User.findOne({ email }).select('+password')
      .orFail(() => {
        throw new AuthError('Неверный email или пароль');
      })
      .then((user) => {
        const {
          _id,
          name,
          about,
          avatar,
        } = user;
        bcrypt.compare(password, user.password)
          .then((matches) => {
            if (matches) {
              const token = jsonwebtoken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '7d' });
              res.cookie('jwt', token, {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
                sameSite: true,
              });
              return res.status(200).send({
                _id,
                name,
                about,
                avatar,
                email,
              });
            }
            throw new AuthError('Неверный email или пароль');
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next(new IncorrectRequestError('Передаются невалидные данные'));
  }
};

module.exports = {
  login,
};
