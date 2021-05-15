import React from "react";

function Login(props) {
  const [userEmail, setUserEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleChange = (e) => {
    const target = e.target;
    target.name === "userEmail" && setUserEmail(target.value);
    target.name === "password" && setPassword(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(userEmail, password);
    // здесь обрабатываем вход в систему
    // запускается, если пользователь не найден}
  };

  return (
    <div className="popup__content popup__content_theme_dark">
      <p className="popup__heading popup__heading_theme_dark">Вход</p>
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
          onChange={handleChange}
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
          onChange={handleChange}
          className="popup__form-row popup__form-row_theme_dark popup__form-row_type_password"
          placeholder="Пароль"
        />
        <button type="submit" className="popup__save popup__save_theme_dark">
          Войти
        </button>
      </form>
    </div>
  );
}
export default Login;
