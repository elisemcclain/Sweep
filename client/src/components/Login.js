import React, { useEffect, useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { UserContext } from "./UserContext";
import Signup from "./Signup";

const Login = ({ users }) => {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useContext(UserContext);

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
      const response = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(currentUser);
        history.push(`/profile/${data.first_name}`);
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

  function handleChange() {
    history.push("/signup");
  }

  return (
    <div>
      <h2>Login</h2>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      <button
        onClick={async () => {
          const currentUser = await Signup();
          setCurrentUser(currentUser);
        }}
      >
        hi
      </button>
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
        <button onClick={handleChange} type="submit">
          Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
