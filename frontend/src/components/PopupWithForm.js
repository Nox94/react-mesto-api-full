export default function PopupWithForm(props) {
  return (
    <div className={`popup ${props.name} ${props.isOpen && "popup_opened"}`}>
      <div className="popup__content">
        <button
          type="button"
          className="popup__close"
          aria-label="Закрыть"
          onClick={props.onClose}
        />
        <h2 className="popup__heading">{props.title}</h2>
        <form
          className="popup__form"
          id={props.formId}
          action="#"
          name="Form"
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button
            className="popup__save"
            type="submit"
            aria-label={props.buttonLabel}
            name="submit"
          >
            {props.buttonName}
          </button>
        </form>
      </div>
    </div>
  );
}
