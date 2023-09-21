import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import CrimeMap from "./CrimeMap";
import CrimeForm from "./CrimeForm";
import Profile from "./Profile";
import Signup from "./Signup";
import Styles from "./Styles.css";
import { UserContext } from "./UserProvider";

function App() {
  const [users, setUsers] = useState([]);
  const history = useHistory();
  let user = useContext(UserContext);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/users")
      .then((r) => r.json())
      .then((r) => {
        setUsers(r);

        fetch("http://127.0.0.1:5555/currentuser", {
          method: "GET",
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Request failed with status: " + response.status);
            }
            return response.text();
          })
          .then((userData) => {
            if (userData.trim() !== "") {
              try {
                const userDataJSON = JSON.parse(userData);
                console.log(userDataJSON);
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            } else {
              console.log("No JSON data received from check_session");
            }
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

  return (
    <BrowserRouter>
      <main>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login users={users} />
          </Route>
          <Route exact path="/signup">
            <Signup handleAddUser={handleAddUser} />
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
