import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/currentuser", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("User not authenticated");
        }
      })
      .then((userData) => {
        setUser(userData);
        // setLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setUser(null);
        // setLoggedIn(false);
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
