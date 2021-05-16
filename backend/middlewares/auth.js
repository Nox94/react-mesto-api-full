const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log(req.headers.authorization);
  if (!token) {
    const customError = new AuthError('Необходима авторизация.');
    next(customError);
  } else {
    let payload;

    try {
      payload = jwt.verify(
        token,
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
    } catch (err) {
      const customError = new AuthError('Необходима авторизация.');
      next(customError);
    }
    req.user = payload;
    next();
  }
};
