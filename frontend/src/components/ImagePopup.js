const ImagePopup = (props) => {
  // console.log(props);
  return (
    <div className={`popup popup-image ${props.isOpen && "popup_opened"}`}>
      <div className="popup__wrapper">
        <button
          type="button"
          className="popup__close popup__close_picture"
          aria-label="Закрыть"
          onClick={props.onClose}
        />
        <img className="popup__picture" src={`${props.card.link}`} alt="#" />
        <p className="popup__capture">{`${props.card.name}`}</p>
      </div>
    </div>
  );
};

export default ImagePopup;
