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
            <Link to="/" className="header-home1">Punna.in </Link>
        </li>

        <li>
          <Link to="/resume"  className="header-home1">Resume </Link>
        </li>
        <li>
          <Link to="/project" className="header-home1">Projects </Link>
        </li>
        <li>
          <Link to="/contact"  className="header-home1">Contact</Link>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
