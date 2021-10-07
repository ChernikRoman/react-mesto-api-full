const bcrypt = require('bcrypt');
const User = require('../models/user');
const IncorrectRequestError = require('../errors/incorrectRequestError');
const ConflictError = require('../errors/conflictError');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

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
};

module.exports = {
  createUser,
};
