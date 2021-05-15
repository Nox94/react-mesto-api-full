import React from "react";
import PopupWithForm from "./PopupWithForm";
export default function AddPlacePopup(props) {
  const inputName = React.useRef(null);
  const inputLink = React.useRef(null);
  const handleAddPlaceSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: inputName.current.value,
      link: inputLink.current.value,
    };
    props.onAddPlace(data);
    props.onClose();
  };

  return (
    <PopupWithForm
      name="popup-cards"
      title="Новое место"
      formId="popupCardElemSave"
      buttonLabel="Создать"
      buttonName="Создать"
      isOpen={props.isOpen}
      onSubmit={handleAddPlaceSubmit}
      onClose={props.onClose}
    >
      <fieldset className="popup__form-fieldset">
        <input
          className="popup__form-row popup__form-row_type_heading"
          id="popup-cards-heading"
          type="text"
          name="name"
          minLength={2}
          maxLength={30}
          required
          autoComplete="off"
          noValidate
          placeholder="Название"
          ref={inputName}
        />
        <span id="popup-cards-heading-error" className="error" />
        <input
          className="popup__form-row popup__form-row_type_link"
          id="popup-cards-link"
          type="url"
          name="link"
          required
          noValidate
          placeholder="Ссылка на картинку"
          ref={inputLink}
        />
        <span id="popup-cards-link-error" className="error" />
      </fieldset>
    </PopupWithForm>
  );
}
