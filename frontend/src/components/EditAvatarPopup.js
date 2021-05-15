import PopupWithForm from "./PopupWithForm";
import React from "react";
export default function EditAvatarPopup(props) {
  const inputElement = React.useRef(null);
  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: inputElement.current.value,
    });
  }
  return (
    <PopupWithForm
      name="popup-changeAvatar"
      title="Обновить аватар"
      formId="popupChangeAvatar"
      buttonLabel="Сохранить"
      buttonName="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__form-fieldset">
        <input
          className="popup__form-row popup__form-row_type_url"
          type="url"
          name="avatar"
          placeholder="Введите url-адрес"
          minLength={12}
          maxLength={1000}
          autoComplete="off"
          id="url-avatar"
          noValidate
          required
          ref={inputElement}
        />
        <span id="url-avatar-error" className="error" />
      </fieldset>
    </PopupWithForm>
  );
}
