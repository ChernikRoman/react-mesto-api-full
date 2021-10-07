const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = /^(https*:\/\/)(www.)?[\w.\/-]*(#$)*/gm;
      return regex.test(value);
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = /[\w.-]+@[\w]+.[\w]+/g;
      return regex.test(value);
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
