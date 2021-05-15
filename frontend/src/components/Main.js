import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";

export default function Main(props) {
  const user = React.useContext(CurrentUserContext);
  const getCardDataFromCard = (data) => {
    props.onCardClick(data);
  };

  return (
    <>
      <section className="profile">
        <div className="profile__wrapper-fullscreen">
          <a className="profile__pencil-icon" />
          <img
            className="profile__avatar"
            src={user.avatar}
            alt={user.name}
            onClick={props.avatarEditOnClick}
          />
          <div className="profile__wrapper-for-rows">
            <div className="profile__wrapper">
              <button
                className="profile__button-edit"
                type="button"
                aria-label="Редактировать"
                onClick={props.profileEditOnClick}
              />
              <h1 className="profile__heading">{user.name}</h1>
            </div>
            <p className="profile__subheading">{user.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__button-add"
          aria-label="Добавить"
          onClick={props.addPlaceOnClick}
        />
      </section>
      <section className="elements">
        {props.cards.map((item) => (
          <Card
            key={item._id}
            link={item.link}
            name={item.name}
            likes={item.likes}
            getCardData={getCardDataFromCard}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
            card={item}
          />
        ))}
      </section>
    </>
  );
}
