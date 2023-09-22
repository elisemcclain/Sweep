import { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "./UserProvider";

function Profile({ setLoggedIn }) {
  const history = useHistory();
  let user = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5555/profile/${id}`);
        if (!response.ok) {
          throw new Error("Request failed with status: " + response.status);
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [id]);

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
