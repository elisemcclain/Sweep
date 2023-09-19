import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function EditProfile({ currentUser }) {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    password: "",
  });

  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:5555/currentuserpy", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          history.push("/login");
        }
      })
      .then((data) => {
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          address: data.address,
          password: data.password,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [history]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/users/<int:id>", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 200) {
          history.push(`profile/{first_name}`);
        } else {
          console.error("Error updating profile:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="address"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
