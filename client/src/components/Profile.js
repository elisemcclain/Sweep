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

  const initialValues = {
    email: user.email || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    address: user.address || "",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5555/current_user", {
          credentials: "include",
        });

        if (response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
          console.log(user);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    if (!user) {
      fetchUserData();
    }
  }, [user, setUser]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    first_name: Yup.string().required("First name is required").max(20),
    last_name: Yup.string().required("Last name is required").max(20),
    // address: Yup.string().required("Address is required").max(200),
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
      <div className="crime-form-container">
        <section className="text-center">
          <div
            className="p-5 bg-image"
            style={{
              height: "130px",
            }}
          ></div>

          <div
            className="card mx-4 mx-md-5 shadow-5-strong"
            style={{
              marginTop: "-100px",
              background: "hsla(0, 0%, 100%, 0.8)",
              backdropFilter: "blur(30px)",
            }}
          >
            {!editMode ? (
              <div>
                <h2>Welcome, {user.first_name}</h2>
                <p>Email: {user.email}</p>
                <p>First Name: {user.first_name}</p>
                <p>Last Name: {user.last_name}</p>
                <p>Address: {user.location && user.location.address}</p>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                  onClick={toggleEditMode}
                >
                  Edit Profile
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {editMode ? (
        <div>
          <h2>Edit Profile</h2>
          <div className="crime-form-container">
            <section className="text-center">
              <div
                className="p-5 bg-image"
                style={{
                  height: "130px",
                }}
              ></div>

              <div
                className="card mx-4 mx-md-5 shadow-5-strong"
                style={{
                  marginTop: "-100px",
                  background: "hsla(0, 0%, 100%, 0.8)",
                  backdropFilter: "blur(30px)",
                }}
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div>
                        <label>Email:</label>
                        <Field
                          type="text"
                          name="email"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div>
                        <label>First Name:</label>
                        <Field
                          type="text"
                          name="first_name"
                          className="form-control"
                        />
                        <ErrorMessage name="first_name" component="div" />
                      </div>
                      <div>
                        <label>Last Name:</label>
                        <Field
                          type="text"
                          name="last_name"
                          className="form-control"
                        />
                        <ErrorMessage name="last_name" component="div" />
                      </div>
                      {/* <div>
                        <label>Address:</label>
                        <Field
                          type="text"
                          name="address"
                          className="form-control"
                        />
                        <ErrorMessage name="address" component="div" />
                      </div> */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-block mt-4"
                      >
                        Save
                      </button>
                    </Form>
                  )}
                </Formik>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="btn btn-danger btn-block mt-4"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
