import React, { useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "./UserProvider";
import "./Login.css";

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

  function handleClick() {
    history.push("/signup");
  }

  return (
    <div className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem", marginTop: "-100px" }}
            >
              <div
                className="card-body p-5 text-center"
                style={{ borderRadius: "1rem", backgroundColor: "#e5e9fc" }}
              >
                <h2
                  className="fw-bold mb-2 text-uppercase"
                  style={{ color: "#33468a" }}
                >
                  Login
                </h2>
                <br></br>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-outline form-white mb-4">
                        <label
                          htmlFor="email"
                          className="form-label"
                          style={{ color: "#33468a" }}
                        >
                          Email
                        </label>
                        <Field
                          type="email"
                          id="typeEmailX"
                          name="email"
                          className="form-control form-control-lg"
                          style={{ fontSize: "16px" }}
                        />
                      </div>

                      <div className="form-outline form-white mb-4">
                        <label
                          htmlFor="password"
                          className="form-label"
                          style={{ color: "#33468a" }}
                        >
                          Password
                        </label>
                        <Field
                          type="password"
                          id="typePasswordX"
                          name="password"
                          className="form-control form-control-lg"
                          style={{ fontSize: "16px" }}
                        />
                      </div>

                      {/* <p className="small mb-5 pb-lg-2">
                        <a href="#!" className="text-white-50">
                          Forgot password?
                        </a>
                      </p> */}

                      <button
                        type="submit"
                        className="btn btn-outline-light btn-lg px-5"
                        style={{ backgroundColor: "#33468a", color: "#fff" }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging in..." : "Log In"}
                      </button>
                      <p style={{ color: "#33468a" }}>or</p>
                      <button
                        type="submit"
                        className="btn btn-outline-light btn-md px-3"
                        style={{ backgroundColor: "#33468a", color: "#fff" }}
                        onClick={handleClick}
                      >
                        Create an account
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
