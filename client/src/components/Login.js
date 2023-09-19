import React from "react";
import { useFormik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const Login = ({ users, currentUser, setCurrentUser }) => {
  const history = useHistory();

  const handleLogin = (user) => {
    setCurrentUser(users);
    history.push(`/profile/${user.first_name}`);
  };

  const handleAccClick = (user) => {
    history.push("/signup");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      handleLogin(values);
      setCurrentUser(currentUser);
    },
  });

  return (
    <div className="login-container">
      <section className="text-center text-lg-start">
        <h2>Login</h2>
        <style>
          {`
            .rounded-t-5 {
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
            }

            @media (min-width: 992px) {
              .rounded-tr-lg-0 {
                border-top-right-radius: 0;
              }

              .rounded-bl-lg-5 {
                border-bottom-left-radius: 0.5rem;
              }
            }
          `}
        </style>
        <div className="card mb-3">
          <div className="row g-0 d-flex align-items-center">
            <div className="col-lg-8">
              <div className="card-body py-5 px-md-5">
                <form onSubmit={formik.handleSubmit}>
                  {/* Email input */}
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="email"
                      {...formik.getFieldProps("email")}
                      className={`form-control ${
                        formik.touched.email && formik.errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password input */}
                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="password"
                      {...formik.getFieldProps("password")}
                      className={`form-control ${
                        formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter your password"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    Log in
                  </button>
                </form>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  onClick={handleAccClick}
                >
                  Click here to create an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
