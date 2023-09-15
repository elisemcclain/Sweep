import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

function Profile({ currentUser, handleChangeUser }) {
  const { first_name } = useParams();
  const [edit, setEdit] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    location_id: Yup.string().required("Location is required"),
    // You can add validation for the password if needed
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.status === 202) {
        const updatedUserData = await response.json();
        handleChangeUser(updatedUserData);
        setEdit(false); // Turn off edit mode after successful update
      } else {
        console.error("Error updating user:", response.status);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
              onClick={() => setEdit(!edit)}
              className="edit-prof-button custom-edit-button"
            >
              {edit ? "Cancel" : "Edit Profile"}
            </button>
          </div>
          <div className="bar-background">
            {edit ? (
              <Formik
                initialValues={{
                  email: currentUser.email,
                  first_name: currentUser.first_name,
                  last_name: currentUser.last_name,
                  location_id: currentUser.location_id,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div>
                    <label>Email</label>
                    <Field type="email" name="email" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div>
                    <label>First Name</label>
                    <Field type="text" name="first_name" />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <Field type="text" name="last_name" />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div>
                    <label>Location</label>
                    <Field type="text" name="location_id" />
                    <ErrorMessage
                      name="location_id"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div>
                    <button type="submit">Save Profile</button>
                  </div>
                </Form>
              </Formik>
            ) : (
              <div>
                <h3>First Name: {currentUser.first_name}</h3>
                <h3>Last Name: {currentUser.last_name}</h3>
                <h3>Email: {currentUser.email}</h3>
                <h4>Location: {currentUser.location_id}</h4>
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
