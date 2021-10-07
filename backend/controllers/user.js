const User = require('../models/user');
const getUserId = require('../utils/getUserId');
const IncorrectRequesError = require('../errors/incorrectRequestError');
const NotFoundError = require('../errors/notFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectRequesError('Передаются невалидные данные для обновления'));
      }
      next(err);
    });
};

const getMyUserInfo = (req, res, next) => {
  User.findById(getUserId(req))
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(getUserId(req), { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectRequesError('Передаются невалидные данные для обновления'));
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(getUserId(req), { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError('Передаются невалидные данные для обновления'));
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getMyUserInfo,
  updateUserData,
  updateUserAvatar,
};
