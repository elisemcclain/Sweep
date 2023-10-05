import React, { useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "./UserProvider";

const Login = ({ onLogin }) => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  function handleUser(x) {
    setUser(x);
    history.push(`/profile/${x.first_name}`);
  }

  const handleSubmit = (values) => {
    fetch("http://localhost:5555/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error during login-FE:");
        }
      })
      .then((data) => {
        handleUser(data);
        // console.log(data);
        // console.log(user);
      })
      .catch((error) => {
        console.error("Error during login-FE:", error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">email</label>
              <Field type="text" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
