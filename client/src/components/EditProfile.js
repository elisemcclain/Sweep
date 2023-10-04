import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserProvider";

function EditProfile() {
  const initialValues = {
    email: user.email,
    address: user.address,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    address: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Send a PATCH request to update the user's information
    fetch("http://127.0.0.1:5555/current_user", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((userInfo) => {
            setUser(userInfo);
          });
        } else {
          throw new Error("Update failed with status: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Update Error:", error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
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
  );
}

export default EditProfile;
