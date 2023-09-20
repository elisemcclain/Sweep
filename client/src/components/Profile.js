import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserProvider, useUser } from "./UserProvider";

function Profile() {
  const history = useHistory();
  const user = useUser();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/currentuserpy", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          user(data);
          console.log(data);
          console.log(user.first_name);
        } else if (response.status == 401) {
          history.push("/login");
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCurrentUser();
  }, [history, user]);

  const handleEditProfile = () => {
    history.push("/edit-profile");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:5555/logout`, {
        method: "POST",
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
        <h2>{/* Welcome, {user.first_name} {user.last_name} */}</h2>
        {/* <p>Email: {currentUserData.email}</p> */}
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
