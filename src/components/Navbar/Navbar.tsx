import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar__brand">⚛ React Flow App</span>
      <ul className="navbar__links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/diagram"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Diagram
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
