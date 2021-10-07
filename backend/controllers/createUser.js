const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const IncorrectRequestError = require('../middlewares/incorrectRequestError');
const ConflictError = require('../middlewares/conflictError');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((user) => {
            res.send({
              data: {
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
              },
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new IncorrectRequestError('Переданы некорректные данные при создании пользователя'));
            }
            if (err.name === 'MongoServerError' && err.code === 11000) {
              next(new ConflictError('Пользователь с таким email уже существует'));
            }
            next(err);
          });
      });
  } else {
    next(new IncorrectRequestError('Переданы некорректные данные при создании пользователя'));
  }
};

module.exports = {
  createUser,
};
