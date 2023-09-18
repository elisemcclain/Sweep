// login.js

import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

// const Login = ({ users, handleAddUser, handleLogin }) => {
//   const [loginType, setLoginType] = useState(false);
const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Required"),
    password: yup.string().required("Required"),
  });

  const history = useHistory();

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Handle successful login
      } else {
        // Handle login failure, e.g., show an error message
      }
    } catch (error) {
      // Handle network or other errors
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
        <button type="submit" onClick={history.push("/signup")}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
