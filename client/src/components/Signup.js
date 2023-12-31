import React, { useContext, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
// import Profile from "./Profile";
import { UserContext } from "./UserProvider";

const Signup = ({ handleAddUser }) => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:5555/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      });

      if (response.status === 201) {
        const data = await response.json();
        setUser(data);
        const profileUrl = `/profile/${data.first_name}`;
        history.push(profileUrl);
        console.log("User registered successfully!!");
        console.log(data);
        console.log(user);
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

  function handleSwitch() {
    history.push("/login");
  }

  return (
    <div>
      <section className="text-center">
        <div
          className="card mx-4 mx-md-5 shadow-5-strong"
          style={{
            borderRadius: "1rem",
            backgroundColor: "#e5e9fc",
            marginTop: "70px",
            marginBottom: "84px",
          }}
        >
          <div className="card-body py-5 px-md-5">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-5" style={{ color: "#33468a" }}>
                  CREATE ACCOUNT
                </h2>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {() => (
                    <Form>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <Field
                              type="text"
                              id="form3Example1"
                              name="first_name"
                              className="form-control"
                              placeholder="First name"
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example1"
                              style={{ color: "#33468a" }}
                            >
                              First name
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <Field
                              type="text"
                              id="form3Example2"
                              name="last_name"
                              className="form-control"
                              placeholder="Last name"
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example2"
                              style={{ color: "#33468a" }}
                            >
                              Last name
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="form-outline mb-4">
                        <Field
                          type="address"
                          id="form3Example44"
                          name="address"
                          className="form-control"
                          placeholder="Address"
                        />
                        <label
                          className="form-label"
                          htmlFor="form3Example3"
                          style={{ color: "#33468a" }}
                        >
                          Address
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <Field
                          type="email"
                          id="form3Example3"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                        />
                        <label
                          className="form-label"
                          htmlFor="form3Example3"
                          style={{ color: "#33468a" }}
                        >
                          Email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <Field
                          type="password"
                          id="form3Example4"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                        />
                        <label
                          className="form-label"
                          htmlFor="form3Example4"
                          style={{ color: "#33468a" }}
                        >
                          Password
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-block mb-4"
                        style={{ backgroundColor: "#33468a", color: "#fff" }}
                      >
                        Sign up
                      </button>
                    </Form>
                  )}
                </Formik>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                  style={{ backgroundColor: "#33468a", color: "#fff" }}
                  onClick={handleSwitch}
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
