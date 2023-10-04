import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import CrimeMap from "./CrimeMap";
import CrimeForm from "./CrimeForm";
import Profile from "./Profile";
import Signup from "./Signup";
import EditProfile from "./EditProfile";

// import Styles from "./Styles.css";
import { UserContext } from "./UserProvider";

function App() {
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  // const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/users")
      .then((r) => r.json())
      .then((r) => {
        setUsers(r);
        // console.log(user);
      });
  }, []);

  const handleAddUser = (newUser) => {
    const updatedUserArray = [...users, newUser];
    setUsers(updatedUserArray);
    console.log({ updatedUserArray });
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <main>
        <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login users={users} onLogin={handleLogin} />
          </Route>
          <Route exact path="/signup">
            <Signup
              handleAddUser={handleAddUser}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          </Route>
          <Route exact path="/crimemap">
            <CrimeMap />
          </Route>
          <Route exact path="/profile/:first_name">
            <Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          </Route>
          <Route exact path="/profile/edit">
            <EditProfile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          </Route>
          <Route exact path="/crimereport">
            <CrimeForm />
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
