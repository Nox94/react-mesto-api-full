import { Link, Route } from "react-router-dom";
export default function Footer(props) {
  const date = new Date().getFullYear();
  return (
    <Route exact path="/">
    <footer className="footer">
      <p className="footer__copyright">© {date} Mesto Russia</p>
    </footer>
    </Route>
  );
}