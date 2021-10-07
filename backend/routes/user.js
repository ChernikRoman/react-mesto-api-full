const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  getMyUserInfo,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/user');
const checkLink = require('../utils/checkLink');

router.get('/', getUsers);

router.get('/me', getMyUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(checkLink).required(),
  }),
}), updateUserAvatar);

module.exports = router;
