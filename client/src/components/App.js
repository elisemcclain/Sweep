import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";

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
        const updatedUsers = users.filter((u) => u.username !== user.username);
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
      {/* <main> */}
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
      </Switch>
      {/* </main> */}
    </BrowserRouter>
  );
}

export default App;
