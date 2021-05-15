import PopupWithForm from "./PopupWithForm";
import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup(props) {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const currentUser = useContext(CurrentUserContext);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  };
  const onChange = (e) => {
    const target = e.target;
    target.name === "name" && setName(target.value);
    target.name === "about" && setDescription(target.value);
  };

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  return (
    <PopupWithForm
      name="popup-profile"
      title="Редактировать профиль"
      formId="popupProfileSave"
      buttonLabel="Сохранить"
      buttonName="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__form-fieldset">
        <input
          className="popup__form-row popup__form-row_type_name"
          type="text"
          name="name"
          value={name || ''}
          onChange={onChange}
          placeholder="Имя"
          minLength={2}
          maxLength={40}
          autoComplete="off"
          id="name-profile"
          noValidate
          required
        />
        <span id="name-profile-error" className="error" />
        <input
          className="popup__form-row popup__form-row_type_about"
          id="subname-profile"
          type="text"
          name="about"
          value={description || ''}
          onChange={onChange}
          placeholder="О себе"
          required
          minLength={2}
          maxLength={200}
          autoComplete="off"
          noValidate
        />
        <span id="subname-profile-error" className="error" />
      </fieldset>
    </PopupWithForm>
  );
}
