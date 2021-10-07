const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsHandler } = require('./middlewares/cors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(corsHandler);
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));
app.use('/users', auth, require('./routes/user'));
app.use('/cards', auth, require('./routes/card'));
app.use('/logout', auth, require('./routes/logout'));

app.use((req, res, next) => {
  next(new NotFoundError('Такого роута не существует'));
});

app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Ошибка сервера' } = err;
  res.status(statusCode).send({ message });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {

});
