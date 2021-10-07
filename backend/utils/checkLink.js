const validator = require('validator');
const IncorrectRequesError = require('../errors/incorrectRequestError');

function checkLink(link) {
  if (validator.isURL(link)) {
    return link;
  }
  throw new IncorrectRequesError('Переданы некорректные данные при создании карточки');
}

module.exports = checkLink;
