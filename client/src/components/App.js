import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import CrimeMap from "./CrimeMap";
import CrimeForm from "./CrimeForm";
import Profile from "./Profile";
import Signup from "./Signup";
import Styles from "./Styles.css";
import { UserProvider, useUser } from "./UserProvider";

function App() {
  const [users, setUsers] = useState([]);
  const user = useUser();
  const history = useHistory();

  useEffect(() => {
    fetch("http://127.0.0.1:5555/users")
      .then((r) => r.json())
      .then((r) => {
        setUsers(r);

        fetch("http://127.0.0.1:5555/check_session", {
          method: "GET",
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Request failed with status: " + response.status);
            }
            return response.json();
          })
          .then((userData) => {
            console.log(userData);
          })
          .catch((error) => {
            console.error("Error checking session:", error);
          });
      });
  }, []);

  const handleAddUser = (newUser) => {
    const updatedUserArray = [...users, newUser];
    setUsers(updatedUserArray);
    console.log({ updatedUserArray });
  };

  const handleLogin = (user) => {
    console.log(user);
    // You may not need setUser here, as the current user is managed by the UserProvider
  };

  return (
    <BrowserRouter>
      <main>
        <Switch>
          {/* Remove NavBar from here */}
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login users={users} />
          </Route>
          <Route exact path="/signup">
            <Signup handleAddUser={handleAddUser} handleLogin={handleLogin} />
          </Route>
          <Route exact path="/crimemap">
            <CrimeMap />
          </Route>
          <Route exact path="/profile/:first_name">
            <Profile />
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
