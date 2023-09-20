import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserProvider, useUser } from "./UserProvider";

function Profile() {
  const history = useHistory();
  const user = useUser();

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
