import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [userEmail, setUserEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleRegisterChange = (e) => {
    const target = e.target;
    target.name === "userEmail" && setUserEmail(target.value);
    target.name === "password" && setPassword(target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(userEmail, password);
  };
  return (
    <div className="popup__content popup__content_theme_dark">
      <p className="popup__heading popup__heading_theme_dark">Регистрация</p>
      <form
        onSubmit={handleSubmit}
        className="popup__form"
        id="login__form"
        action="#"
        name="Form"
      >
        <input
          required
          id="userEmail"
          name="userEmail"
          type="email"
          minLength={2}
          maxLength={40}
          value={userEmail || ""}
          // noValidate
          autoComplete="off"
          onChange={handleRegisterChange}
          className="popup__form-row popup__form-row_theme_dark popup__form-row_type_email"
          placeholder="Email"
        />
        <input
          required
          id="password"
          name="password"
          type="password"
          minLength={4}
          maxLength={100}
          // noValidate
          autoComplete="off"
          value={password || ""}
          onChange={handleRegisterChange}
          className="popup__form-row popup__form-row_theme_dark popup__form-row_type_password"
          placeholder="Пароль"
        />
        <button type="submit" className="popup__save popup__save_theme_dark">
          Зарегистрироваться
        </button>
        <p className="register__text">
          Уже зарегистрированы?&#8194;
          <Link to="/signin" className="register__link">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
export default Register;