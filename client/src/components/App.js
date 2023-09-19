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

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:3000/users")
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
        <NavBar currentUser={currentUser} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login
              users={users}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </Route>
          <Route exact path="/signup">
            <Signup
              users={users}
              handleAddUser={handleAddUser}
              // handleSignup={handleSignup}
              handleLogin={handleLogin}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </Route>
          <Route exact path="/crimemap">
            <CrimeMap />
          </Route>
          <Route exact path="/profile/:first_name">
            <Profile
              users={users}
              // setUsers={setUsers}
              currentUser={currentUser}
              // setCurrentUser={setCurrentUser}
              // handleChangeUser={handleChangeUser}
            />
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
