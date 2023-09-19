import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();
//this export is what i hvae to use

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    fetch("http://127.0.0.1:5555/currentuserpy", {
      credential: "include",
    })
      .then((response) => response.json())
      .then((response) => setUser(response));
  }, []);
  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};
