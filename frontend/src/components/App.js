import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { useEffect } from "react";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import * as auth from "../utils/auth";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(""); //стейт для мыла в шапке сайта
  const [toolTipStatus, setToolTipStatus] = React.useState("fail");
  const [toolTipOpen, setToolTipOpen] = React.useState(false);

  const history = useHistory();
  useEffect(() => {
    api
      .getTheCards()
      .then((result) => {
        setCards(result);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  function handleTokenCheck() {
    const token = localStorage.getItem("token");
    // console.log(token);
    if (token) {
      // проверим токен
      auth.getContent(token).then((res) => {
        // console.log(res); //есть данные
        if (res) {
          setUserEmail(res.email);
          setLoggedIn(true);
          history.push("/");
        }
      });
    }
  }

  function handleTokenErase() {
    localStorage.setItem("token", "");
    // console.log(localStorage);
    setUserEmail(" ");
    setLoggedIn(false);
  }

  const handleCardLike = (card) => {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (card) => {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  };

  //добавила переменную состояния текущего пользователя и эффект,
  //который вызывает api.getUserInfo и обновляет стейт-переменную из полученного значения.
  useEffect(() => {
    api
      .getUserInfo()
      .then((result) => {
        setCurrentUser(result);
        // console.log(currentUser);
        //устанавливает объект с данными юзера как значение переменной
      })
      .catch((err) => console.log(err));
  }, []);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
    setToolTipOpen(false);
  }

  const handleCardClick = (data) => {
    setSelectedCard(data);
    setIsImagePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleUpdateUser(data) {
    api
      .saveUserInfo(data)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(data) {
    api
      .changeUserAvatar(data)
      .then((result) => {
        setCurrentUser({ ...currentUser, avatar: result.avatar });
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  function handleAddPlaceSubmit(data) {
    api
      .createNewCard(data)
      .then((result) => {
        const newCard = result;
        setCards([newCard, ...cards]);
      })
      .catch((err) => console.log(err));
  }
  function handleLoginSubmit(userEmail, password) {
    auth
      .authorize(userEmail, password)
      .then((res) => {
        console.log(res);
        if (res.token) {
          // setToolTipStatus("success");
          // setToolTipOpen(true);
          setLoggedIn(true);
          setUserEmail(userEmail);
          history.push("/");
        }
      })
      .catch((err) => {
        setToolTipStatus("fail");
        setToolTipOpen(true);
        console.log(err);
      });
  }

  const handleRegisterSubmit = (userEmail, password) => {
    // здесь обрабатываем вход в систему
    auth
      .register(userEmail, password)
      .then((res) => {
        if (res.data._id) {
          setToolTipStatus("success");
          setToolTipOpen(true);
          history.push("/signin");
        } else {
          setToolTipStatus("fail");
          setToolTipOpen(true);
        }
      })
      .catch((err) => {
        setToolTipStatus("fail");
        setToolTipOpen(true);
        console.log(err);
      });
  };

  return (
    //передаю объект с данными пользователя как контекст всем дочерним ком-м
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="root">
          <Header
            loggedIn={loggedIn}
            userData={currentUser}
            email={userEmail} //для мыла в шапке
            tokenErase={handleTokenErase}
          />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              component={Main}
              profileEditOnClick={handleEditProfileClick}
              avatarEditOnClick={handleEditAvatarClick}
              addPlaceOnClick={handleAddPlaceClick}
              onClose={closeAllPopups}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            ></ProtectedRoute>

            <Route path="/signin">
              <div className="loginContainer">
                <Login onSubmit={handleLoginSubmit} />
              </div>
            </Route>

            <Route path="/signup">
              <div className="registerContainer">
                <Register onSubmit={handleRegisterSubmit} />
              </div>
            </Route>

            {/* <Route exact path="/">
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route> */}
          </Switch>

          <Footer />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={isImagePopupOpen}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            cards={cards}
            setCards={setCards}
            onAddPlace={handleAddPlaceSubmit}
          />
          <PopupWithForm
            name="popup-remove"
            title="Вы уверены?"
            buttonLabel="Согласиться"
            buttonName="Да"
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <InfoTooltip
            isOpen={toolTipOpen}
            status={toolTipStatus}
            onClose={closeAllPopups}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
