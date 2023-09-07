import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hamburger from "./Hamburger";

function NavBar({ currentUser }) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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
                  <Link to="/date" className="nav-link">
                    GO ON A DATE
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
              <Link to="/crimereports" className="nav-link">
                CRIME REPORTS
              </Link>
            </li>
            <li>
              <a
                className="nav-link"
                href="https://www.fbi.gov/how-we-can-help-you/more-fbi-services-and-information/ucr"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN MORE
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
