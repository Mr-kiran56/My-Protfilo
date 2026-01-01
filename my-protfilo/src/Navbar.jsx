import "./Navbar.css";
import "./App.css"
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <header>
      <ul className="header-home">
        <li
          className="logo"
          style={{ fontFamily: "Caveat, cursive", fontSize: "40px" }}
        >
          Punna.in
        </li>

        <li>
          <a href="/" className="header-home1">Resume |</a>
        </li>
        <li>
          <a href="/" className="header-home1">Projects |</a>
        </li>
        <li>
          <Link to="/contact" className="header-home1">Contact</Link>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
