const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError'); // 401

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log(req.headers.authorization);
  if (!token) {
    next(new AuthError('Необходима авторизация.'));
  } else {
    let payload;
    try {
      payload = jwt.verify(
        token,
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
    } catch (err) {
      next(new AuthError('Необходима авторизация.'));
    }
    req.user = payload;
    next();
  }
};
