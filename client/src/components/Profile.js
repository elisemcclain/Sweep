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
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Update failed with status: " + response.status);
        }
      })
      .then((userInfo) => {
        setUser(userInfo);
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
      <section style={{ backgroundColor: "#33468a" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  {!editMode ? (
                    <>
                      <h5 className="my-3" style={{ color: "#33468a" }}>
                        {user.first_name} {user.last_name}
                      </h5>
                      <p className="text-muted mb-4">
                        {user.location && user.location.address}
                      </p>
                      <p className="text-muted mb-4">email: {user.email}</p>
                      <div className="d-flex justify-content-center mb-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ backgroundColor: "#33468a", color: "#fff" }}
                          onClick={toggleEditMode}
                        >
                          Edit Profile
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary ms-1"
                          style={{ outlineColor: "#33468a", color: "#33468a" }}
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 style={{ color: "#33468a" }}>Edit Profile</h2>
                      <br></br>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form>
                            <div>
                              <label style={{ color: "#33468a" }}>Email:</label>
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
                              <label style={{ color: "#33468a" }}>
                                First Name:
                              </label>
                              <Field
                                type="text"
                                name="first_name"
                                className="form-control"
                              />
                              <ErrorMessage name="first_name" component="div" />
                            </div>
                            <div>
                              <label style={{ color: "#33468a" }}>
                                Last Name:
                              </label>
                              <Field
                                type="text"
                                name="last_name"
                                className="form-control"
                              />
                              <ErrorMessage name="last_name" component="div" />
                            </div>
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
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-8" style={{ color: "#eef600" }}>
              <div
                className="card mb-4"
                style={{ backgroundColor: "#eef600" }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Profile;
