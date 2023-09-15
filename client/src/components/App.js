import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import CrimeMap from "./CrimeMap";
import Report from "./Report";
import CrimeForm from "./CrimeForm";
import Profile from "./Profile";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/users")
      .then((r) => r.json())
      .then((userArray) => {
        setUsers(userArray);
        console.log({ users, userArray });
      });
  }, []);

  const handleAddUser = (newUser) => {
    const updatedUserArray = [...users, newUser];
    setUsers(updatedUserArray);
    setCurrentUser(newUser);
  };

  const handleLogin = (user) => {
    console.log(user);
    setCurrentUser(user);
  };

  const handleChangeUser = async (user) => {
    setUsers([...users, user]);
    setCurrentUser(user);
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await fetch(`http://localhost:5555/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.status === 200) {
        const updatedUsers = users.filter((u) => u.email !== user.email);
        setUsers(updatedUsers);
        setCurrentUser(null);
      } else {
        console.log("Error deleting user:", response.status);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <BrowserRouter>
      <main>
        <NavBar currentUser={currentUser} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login
              users={users}
              handleAddUser={handleAddUser}
              handleLogin={handleLogin}
            />
          </Route>
          <Route path="/crimemap">
            <CrimeMap />
          </Route>
          <Route exact path="/user/:first_name">
            <Profile
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              handleChangeUser={handleChangeUser}
              handleDeleteUser={handleDeleteUser}
            />
          </Route>
          <Route path="/temprep">
            <Report />
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
