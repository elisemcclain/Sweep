import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import CrimeMap from "./CrimeMap";
import CrimeForm from "./CrimeForm";
import Profile from "./Profile";
import Signup from "./Signup";

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

  const handleLogin = (user) => {
    console.log(user);
    setCurrentUser(user);
  };

  const handleAddUser = (newUser) => {
    const updatedUserArray = [...users, newUser];
    setUsers(updatedUserArray);
    setCurrentUser(newUser);
  };

  return (
    <BrowserRouter>
      <main>
        <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login users={users} handleLogin={handleLogin} />
          </Route>
          <Route exact path="/signup">
            <Signup
              users={users}
              handleAddUser={handleAddUser}
              // handleSignup={handleSignup}
              // handleLogin={handleLogin}
              currentUser={currentUser}
              // setCurrentUser={setCurrentUser}
            />
          </Route>
          <Route exact path="/crimemap">
            <CrimeMap />
          </Route>
          <Route exact path="/profile/:first_name">
            <Profile
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
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
