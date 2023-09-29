import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserProvider";

function Profile({ loggedIn, setLoggedIn }) {
  const history = useHistory();
  let user = useContext(UserContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("http://127.0.0.1:5555/currentuser");
      if (response.status === 200) {
        const userInfo = await response.json();
        setUserData(userInfo);
      } else {
        console.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    history.push("/edit-profile");
  };

  function handleLogout() {
    fetch("http://127.0.0.1:5555/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          history.push("/");
          setLoggedIn(false);
        } else {
          throw new Error("Logout failed with status: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  }

  return (
    <div className="profile-container">
      <div>
        <h2>Welcome, {userData.first_name}</h2>
        <p>Email: {userData.email}</p>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
