/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/AuthError'); // 401
const BadRequestError = require('../errors/CastError'); // 400
const NoIdFoundError = require('../errors/NoIdFoundError'); // 404
const RegisterError = require('../errors/RegisterError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getOneUser = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => {
    if (!user) {
      throw new AuthError('Необходима авторизация.');
    }
    res.send(user);
  })
  .catch(next);

module.exports.getOneUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NoIdFoundError('Пользователь по указанному id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NoIdFound') {
        next(new NoIdFoundError('Пользователь по указанному id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // хеш записан в базу
    }).then((user) => res.status(201).send(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя.',
          ),
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(
          new RegisterError('Пользователь с таким Email уже зарегистрирован.'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateUsersProfileById = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NoIdFoundError('Пользователь по указанному id не найден.');
      }
      res
        .status(201)
        .send(user)
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(
              new BadRequestError(
                'Переданы некорректные данные при обновлении профиля.',
              ),
            );
          } else if (err.message === 'NoIdFound') {
            next(
              new NoIdFoundError('Пользователь по указанному id не найден.'),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.updateUsersAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  console.log(req.user._id);
  console.log(avatar);
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((ava) => {
      console.log(ava);
      if (!ava) {
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении аватара.',
        );
      }
      res.status(201).send(ava);
    })
    .catch((err) => {
      if (err.message === 'NoIdFound') {
        next(new NoIdFoundError('Пользователь по указанному id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  console.log(req.body);
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new BadRequestError('Неправильные почта или пароль'));
      }
      bcrypt
        .compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          // boolean
          if (!matched) {
            next(new BadRequestError('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            {
              expiresIn: '7d',
            },
          );
          res
            .cookie('jwt', token, {
              httpOnly: true,
              sameSite: true,
              maxAge: 36000000 * 24 * 7,
            })
            .status(200)
            .send({ _id: user._id, token });
        });
    })
    .catch((err) => {
      // eslint-disable-next-line consistent-return
      if (err.name === 'ValidationError' || err.name === 'BadRequest') {
        next(new BadRequestError('Введены некорректные данные при попытке авторизоваться.'));
      } else {
        next(err);
      }
    });
};
