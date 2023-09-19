import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

const Login = ({ users, currentUser, setCurrentUser }) => {
  const history = useHistory();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Required"),
    password: yup.string().required("Required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(currentUser);
        history.push("/profile");
        console.log("yay");
      } else {
        console.error("Login failed. Please check the prob.");
      }
    } catch (error) {
      console.error("error occurred:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div>
            <label>Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label>Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </Form>
      </Formik>
      <div>
        <button type="submit">Signup</button>
      </div>
    </div>
  );
};

export default Login;
