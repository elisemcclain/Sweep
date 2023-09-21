import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { UserContext } from "./UserProvider";

const Login = ({ loggedIn }) => {
  const history = useHistory();
  let user = useContext(UserContext);

  const [userData, setUserData] = useState([]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Required"),
    password: yup.string().required("Required"),
  });

  const onSubmit = (values) => {
    fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values, null, 2),
    }).then((response) => {
      if (response.ok) {
        setUserData(userData);
        console.log(loggedIn);
        // console.log(userData);
        console.log(user);
        history.push(`/profile/${user.first_name}`);
        console.log("yay");
      } else {
        console.error("Login failed. Please check the problem.");
      }
    });
  };

  function handleChange() {
    history.push("/signup");
  }

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
        <button onClick={handleChange} type="submit">
          Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
