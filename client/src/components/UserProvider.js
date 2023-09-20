import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Make a fetch request to get the current user data from your server
    fetch("http://127.0.0.1:5555/currentuserpy", {
      method: "GET",
      credentials: "include", // Include credentials for CORS if needed
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
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setUser(null);
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
