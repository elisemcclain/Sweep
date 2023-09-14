import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Hamburger from "./Hamburger";

function NavBar({ currentUser }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    }
  }, [currentUser]);
  const toggleHamburger = () => {
    console.log(currentUser, "current user in NavBar");
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <div>
      <div className="navigation">
        <div className="hamburger" onClick={toggleHamburger}>
          <Hamburger />
        </div>
        <div className={`menu ${hamburgerOpen ? "active" : ""}`}>
          <ul>
            <li className="links">
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>
            {loggedIn ? (
              <>
                <li>
                  <Link
                    to={`/user/${currentUser.username}`}
                    className="nav-link"
                  >
                    PROFILE
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="nav-link">
                    REPORT A CRIME
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">
                    LOGIN
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/crimemap" className="nav-link">
                MAP
              </Link>
            </li>
            <li>
              <a
                className="nav-link"
                href="https://www.apa.org/topics/crisis-hotlines"
                target="_blank"
                rel="noopener noreferrer"
              >
                HELP
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
