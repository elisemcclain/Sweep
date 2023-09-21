import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserProvider";

function Profile({ setLoggedIn }) {
  const history = useHistory();
  let user = useContext(UserContext);
  

  const handleEditProfile = () => {
    history.push("/edit-profile");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:5555/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        history.push("/login");
        setLoggedIn(false);
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="profile-container">
      <div>
        <h2>Welcome, {user.first_name}</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
