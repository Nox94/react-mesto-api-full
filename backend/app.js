require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NoFoundError = require('./errors/NoIdFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3005 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

var whitelist = [
  'http://localhost:3000',
  'https://nox-mesto.nomoredomains.monster',
  'http://nox-mesto.nomoredomains.monster',
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cookieParser());
app.use(requestLogger); // логгер запросов
app.post('/signup', express.json(), createUser);
app.post('/signin', express.json(), login);

// auth дает req.user._id
app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('*', (req, res, next) => {
  next(new NoFoundError('Запрашиваемая страница не найдена.'));
});

app.use(errorLogger); // логгер ошибок

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера.' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
