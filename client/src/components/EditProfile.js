import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserProvider";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function EditProfile() {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

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
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Update failed with status: " + response.status);
        }
      })
      .then((userInfo) => {
        setUser(userInfo);
        history.push(`/profile/${userInfo.first_name}`);
      })
      .catch((error) => {
        console.error("Update Error:", error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
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
    </div>
  );
}

export default EditProfile;
