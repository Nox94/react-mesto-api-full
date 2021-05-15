/* eslint-disable consistent-return */
const Card = require('../models/card');
const CastError = require('../errors/CastError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NoIdFoundError = require('../errors/NoIdFoundError'); // 404

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards) {
        throw new NoIdFoundError('Запрашиваемая вами информация не найдена.');
      }
      res.send({ data: cards });
    })
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError('Введены некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NoIdFoundError('Карточка с таким id не найдена'));
      } else if (card.owner._id.toString() !== userId) {
        next(new ForbiddenError('Вы можете удалить только свою карточку.'));
      } else {
        Card.findByIdAndRemove(cardId)
        // eslint-disable-next-line no-shadow
          .then((card) => {
            if (!card) {
              next(new NoIdFoundError('Карточка с таким id не найдена'));
            }
            res.send({ card });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new CastError('Введены некорректные данные.'));
            } else {
              next(err);
            }
          });
      }
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(new NoIdFoundError('NotFound'))
    .populate(['likes'])
    .then((card) => {
      if (!card) {
        next(new NoIdFoundError('Карточка с указанным _id не найдена.'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new CastError('Переданы некорректные данные для постанови лайка.'),
        );
      } else if (err.message === 'NotFound') {
        next(new NoIdFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NoIdFoundError('NotFound'))
    .then((card) => {
      if (!card) {
        next(new NoIdFoundError('Карточка с указанным _id не найдена.'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new CastError('Переданы некорректные данные для постанови лайка.'),
        );
      } else if (err.message === 'NotFound') {
        next(new NoIdFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};
