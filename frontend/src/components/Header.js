import logo from "../images/logo.svg";
import { Link, Route } from "react-router-dom";
export default function Header(props) {
  const handleTokenErase = () => {
    props.tokenErase();
  };

  return (
    <header className="header">
      <img
        className="header__logo header__logo_theme_dark"
        src={logo}
        alt="Логотип Место."
      />
      <Route path="/signin">
        <Link to="/signup" className="header__register-link">
          Регистрация
        </Link>
      </Route>
      <Route path="/signup">
        <Link to="/signin" className="header__register-link">
          Вход
        </Link>
      </Route>
      <Route exact path="/">
        <p className="header__register-link">
          {props.email}
          <Link
            to="/signin"
            className="header__exit"
            onClick={handleTokenErase}
          >
            Выход
          </Link>
        </p>
      </Route>
    </header>
  );
}
