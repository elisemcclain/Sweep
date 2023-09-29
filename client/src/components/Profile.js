import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserProvider";

function Profile() {
  const history = useHistory();
  let user = useContext(UserContext);
  console.log(user);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/currentuser", {
          credentials: "include",
        });

        if (response.ok) {
          const userInfo = await response.json();
          setUserData(userInfo);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    history.push("/edit-profile");
  };

  const handleLogout = () => {
    fetch("http://127.0.0.1:5555/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          history.push("/");
        } else {
          throw new Error("Logout failed with status: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  return (
    <div className="profile-container">
      <div>
        <h2>Welcome, {userData.first_name}</h2>
        <p>Email: {userData.email}</p>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
