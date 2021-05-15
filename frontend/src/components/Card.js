import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props) {
  const user = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === user._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `elements__remove-button ${
    isOwn ? "elements__remove-button" : "invisible"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.likes.some((i) => i._id === user._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `elements__like-button ${
    isLiked ? "elements__like-button_clicked" : ""
  }`;

  const handleImageClick = () => {
    props.getCardData(props);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  return (
    <div className="elements__card" key={props._id}>
      <img
        className="elements__card-img"
        src={props.link}
        alt="#"
        onClick={handleImageClick}
      />
      <div className="elements__wrapper">
        <h2 className="elements__card-heading">{props.name}</h2>
        <div className="elements__another-wrapper">
          <button
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          />
          <div className="elements__counter">{props.likes.length}</div>
        </div>
      </div>
      <button
        className={cardDeleteButtonClassName}
        type="button"
        onClick={handleDeleteClick}
      />
    </div>
  );
}
