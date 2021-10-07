const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/createUser');
const checkLink = require('../utils/checkLink');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkLink),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = router;
