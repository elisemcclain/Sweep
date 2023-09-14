import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect, useInsertionEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

function Profile({ users, currentUser, handleChangeUser, handleDeleteUser }) {
  const [edit, setEdit] = useState(false);
  const { username } = useParams();
  const [userMatch, setUserMatch] = useState(false);
  const history = useHistory();

  const formShema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    location: Yup.string().required("Location is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (currentUser.email.toLowerCase() === email.toLowerCase()) {
      setUserMatch(true);
    }
  }, [currentUser, email]);

  const EditProfile = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/users/${currentUser.id}`
      );
      if (response.status === 200) {
        const updatedUserData = await response.json();
        handleChangeUser(updatedUserData);
      } else {
        console.error("Error updating user:", response.status);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
    setEdit(!edit);
  };

  return (
    <div>
      <div>
        <div>
          <h1 className="account">PROFILE</h1>
        </div>
      </div>
      <div className="bar-user"></div>
      {currentUser ? (
        <div>
          <div className="edit-prof-button custom-edit-button-move">
            <button
              type="button"
              onClick={EditProfile}
              className="edit-prof-button custom-edit-button"
            >
              {edit ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
          <div className="bar-background">
            {edit ? (
              <div>
                <form onSubmit={formik.handleSubmit}>
                  <br />
                  <div>
                    <lable>Email</lable>
                    <input
                      type="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div>{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <br />
                  <div>
                    <label>First Name</label>
                    <input
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      {...formik.getFieldProps("first_name")}
                    />
                    {formik.touched.first_name && formik.errors.first_name ? (
                      <div>{formik.errors.first_name}</div>
                    ) : null}
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      {...formik.getFieldProps("last_name")}
                    />
                    {formik.touched.last_name && formik.errors.last_name ? (
                      <div>{formik.errors.last_name}</div>
                    ) : null}
                  </div>
                  <div>
                    <label>Location</label>
                    <input
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      {...formik.getFieldProps("locations")}
                    />
                    {formik.touched.locations && formik.errors.locations ? (
                      <div>{formik.errors.locations}</div>
                    ) : null}
                  </div>
                  <br />
                  <div>
                    <label>Password</label>
                    <input
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div>{formik.errors.password}</div>
                    ) : null}
                  </div>
                  <br />
                </form>
              </div>
            ) : (
              <div>
                <h3>First Name: {currentUser.first_name}</h3>
                <h3>Last Name: {currentUser.last_name}</h3>
                <h3>Email: {currentUser.email}</h3>
                <h4>Location: {currentUser.locations}</h4>
                <br />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Not Logged in as current user at this path</h2>
        </div>
      )}
    </div>
  );
}

export default Profile;
