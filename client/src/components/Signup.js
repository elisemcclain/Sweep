import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import Profile from "./Profile";

const Signup = ({
  handleAddUser,
  currentUser,
  setCurrentUser,
  handleLogin,
}) => {
  const formSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").max(100),
    first_name: Yup.string().required("First name is required").max(20),
    last_name: Yup.string().required("Last name is required").max(20),
    address: Yup.string().required("Address is required").max(200),
    password: Yup.string().required("Password is required").max(100),
  });
  const initialValues = {
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    first_name: Yup.string().required("First name is required").max(20),
    last_name: Yup.string().required("Last name is required"),
    address: Yup.string().required("Address is required").max(200),
  });

  const history = useHistory();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:5555/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      });

      if (response.status === 201) {
        const currentUserData = await response.json();
        handleAddUser(currentUserData);
        setCurrentUser(currentUserData);
        console.log(currentUserData.first_name);
        console.log(currentUserData);
        history.push(`/profile/${values.first_name}`);
        alert("User registered successfully!!!!");
      } else {
        const responseData = await response.json();
        if (responseData.error) {
          setErrors({ password: responseData.error });
        } else {
          console.error("Registration failed:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label>First Name:</label>
              <Field type="first_name" name="first_name" />
              <ErrorMessage name="first_name" component="div" />
            </div>
            <div>
              <label>Last Name:</label>
              <Field type="last_name" name="last_name" />
              <ErrorMessage name="last_name" component="div" />
            </div>
            <div>
              <label>Address:</label>
              <Field type="address" name="address" />
              <ErrorMessage name="address" component="div" />
            </div>
            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <div>
              <button type="submit">Sign Up</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
