import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserProvider";
// import EditProfile from "./EditProfile";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Profile() {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5555/current_user", {
          credentials: "include",
        });

        if (response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchUserData();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    first_name: Yup.string().required("First name is required").max(20),
    last_name: Yup.string().required("Last name is required").max(20),
    address: Yup.string().required("Address is required").max(200),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    fetch("http://localhost:5555/current_user", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Update failed with status: " + response.status);
        }
      })
      .then((userInfo) => {
        setUser(userInfo);
        console.log(user);
        console.log("Profile updated successfully:", userInfo);
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Update Error:", error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch("http://localhost:5555/current_user", {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            setUser(null);
            history.push("/");
          } else {
            throw new Error(
              "Delete account failed with status: " + response.status
            );
          }
        })
        .catch((error) => {
          console.error("Delete Account Error:", error);
        });
    }
  };

  const handleLogout = () => {
    fetch("http://127.0.0.1:5555/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setUser(null);
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
        {!editMode ? (
          <div>
            <h2>Welcome, {user.first_name}</h2>
            <p>Email: {user.email}</p>
            <p>First Name: {user.first_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>Address: {user.address}</p>
            <button onClick={toggleEditMode}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : null}
      </div>

      {editMode ? (
        <div>
          <h2>Edit Profile</h2>
          <Formik
            initialValues={{
              email: user.email,
              address: user.address,
              first_name: user.first_name,
              last_name: user.last_name,
              address: user.address,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <label>Email:</label>
                  <Field type="text" name="email" />
                  <ErrorMessage name="email" component="div" />
                </div>
                <div>
                  <label>First Name:</label>
                  <Field type="text" name="first_name" />
                  <ErrorMessage name="first_name" component="div" />
                </div>
                <div>
                  <label>Last Name:</label>
                  <Field type="text" name="last_name" />
                  <ErrorMessage name="last_name" component="div" />
                </div>
                <div>
                  <label>Address:</label>
                  <Field type="text" name="address" />
                  <ErrorMessage name="address" component="div" />
                </div>
                <button type="submit" disabled={isSubmitting}>
                  Save
                </button>
              </Form>
            )}
          </Formik>
          <button type="button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
