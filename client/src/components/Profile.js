import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Signup from "./Signup";

function Profile({ currentUser, currentUserData }) {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:5555/currentUserPy", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else if (response.status === 401) {
          history.push("/login");
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCurrentUser();
  }, [history]);

  const handleEditProfile = () => {
    history.push("/edit-profile");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5555/logout", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 204) {
        history.push("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="profile-container">
      <h1>hi</h1>
      <div>
        <h2>
          {/* Welcome, {currentUserData.first_name} {currentUserData.last_name} */}
        </h2>
        {/* <p>Email: {currentUserData.email}</p> */}
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
