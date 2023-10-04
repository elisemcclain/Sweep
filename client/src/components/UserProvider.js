import { createContext, useState, useContext, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/current_user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setUser(null);
        setError("Failed to fetch user data.");
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
