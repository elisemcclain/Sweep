import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import CrimeMap from "./CrimeMap";
import CrimeForm from "./CrimeForm";
import Profile from "./Profile";
import Signup from "./Signup";
import Styles from "./Styles.css";
import { Map } from "@googlemaps/react-wrapper";
import { UserContext } from "./UserContext";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const providerValue = useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser, setCurrentUser]
  );
  const history = useHistory();

  useEffect(() => {
    fetch("http://127.0.0.1:5555/users")
      .then((r) => r.json())
      .then((userArray) => {
        setUsers(userArray);
      });
  }, []);

  const handleAddUser = (newUser) => {
    const updatedUserArray = [...users, newUser];
    setUsers(updatedUserArray);
    setCurrentUser(newUser);
    console.log({ updatedUserArray });
  };

  const handleLogin = (user) => {
    console.log(user);
    setCurrentUser(user);
  };

  return (
    <BrowserRouter>
      <main>
        <Switch>
          <UserContext.Provider value={{ providerValue }}>
            <NavBar />
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
          </UserContext.Provider>
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;

// const handleChangeUser = async (user) => {
//   setUsers([...users, user]);
//   setCurrentUser(user);
// };

// const handleDeleteUser = async (user) => {
//   try {
//     const response = await fetch(`http://localhost:5555/users/${user.id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     });
//     if (response.status === 200) {
//       const updatedUsers = users.filter((u) => u.email !== user.email);
//       setUsers(updatedUsers);
//       setCurrentUser(null);
//     } else {
//       console.log("Error deleting user:", response.status);
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//   }
// };
