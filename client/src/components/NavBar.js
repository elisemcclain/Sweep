import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function NavBar({ currentUser, setCurrentUser }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    }
  }, [currentUser]);

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container">
          <ul className="navbar-brand mb-0 h1">
            <Link to="/" className="d-inline-block align-top" width="140">
              SWEEP
            </Link>
          </ul>
          <button
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            className="navbar-toggler"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <ul className="nav-item active">
                <Link to="/" className="nav-link">
                  HOME
                </Link>
              </ul>
              {loggedIn ? (
                <>
                  <li className="nav-item active">
                    <Link
                      to={`/profile/${currentUser.first_name}`}
                      // className="nav-link"
                      type="button"
                      className="btn btn-primary btn-block active btn btn-primarybtn-sm m1-2"
                    >
                      PROFILE
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link to="/crimereport" className="nav-link">
                      REPORT A CRIME
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item active">
                    <Link
                      to="/login"
                      // className="nav-link"
                      type="button"
                      className="btn btn-primary btn-block active btn btn-primarybtn-sm m1-2"
                    >
                      LOGIN
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item active">
                <Link to="/crimemap" className="nav-link">
                  MAP
                </Link>
              </li>
              <li className="nav-item active">
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
      </nav>
    </div>
  );
}

export default NavBar;
