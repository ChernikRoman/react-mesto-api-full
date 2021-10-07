const Card = require('../models/card');
const getUserId = require('../utils/getUserId');
const AuthError = require('../middlewares/authError');
const IncorrectRequesError = require('../middlewares/incorrectRequestError');
const NotFoundError = require('../middlewares/notFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: getUserId(req) })
    .then((card) => res.send(card))
    .catch(() => {
      next(new IncorrectRequesError('Переданы некорректные данные при создании карточки'));
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        return card;
      }
      throw new NotFoundError('Нет карточки по заданному id');
    })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (getUserId(req) == card.owner._id.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          // eslint-disable-next-line no-shadow
          .then((card) => {
            res.status(200).send(card);
          })
          .catch(next);
      } else {
        throw new AuthError('Недостаточно прав для удаления карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectRequesError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};

const setLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Нет карточки по заданному id');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectRequesError('Переданы некорректные данные для постановки лайка'));
      }
      next(err);
    });
};

const unsetLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Нет карточки по заданному id');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next('Переданы некорректные данные для снятии лайка');
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  unsetLike,
};
