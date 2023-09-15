import React, { useEffect, useState } from "react";
import { Formik, FormikConsumer, useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

const Login = ({ users, handleAddUser, handleLogin }) => {
  const [loginType, setLoginType] = useState(false);
  const history = useHistory();
  const formSchema = yup.object().shape({
    email: yup.string().required("Email is required").max(100),
    first_name: yup.string().required("First name is required").max(20),
    last_name: yup.string().required("Last name is required").max(20),
    password_hash: yup.string().required("Password is required").max(100),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password_hash: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const emailExists = users.find(
        (user) => user.email.toLowerCase() === values.email.toLowerCase()
      );
      if (loginType) {
        if (emailExists) {
          alert("Email already exists");
        } else {
          try {
            const response = await fetch("http://127.0.0.1:5555/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(values, null, 2),
            });
            if (response.status === 201) {
              const data = await response.json();
              console.log("User Created:", data);
              handleAddUser(data);
              history.push(`/user/${data.first_name}`);
            } else {
              console.log("Failed to Create User:", response.statusText);
            }
          } catch (error) {
            console.error("Error Posting Users:", error);
          }
        }
      } else {
        if (emailExists && emailExists.password === values.password_hash) {
          handleLogin(emailExists);
          history.push(`/user/${emailExists.first_name}`);
        } else {
          alert("Invalid Email or Password");
        }
      }
    },
  });

  return (
    <div>
      <div>
        <h1 className="welcome">WELCOME</h1>
      </div>
      <div className="greet">
        Enter your email to log in or create an account
      </div>
      <div className="signup-move">
        <button onClick={() => setLoginType(!loginType)} className="signup">
          {loginType ? "Back to Login" : "Click to Create Account"}
        </button>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <br />
        {loginType && (
          <div>
            <label className="email" htmlFor="email">
              Email:{" "}
            </label>
            <input
              className="email-color"
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <p className="error-message"> {formik.errors.email}</p>
          </div>
        )}
        <label className="first_name" htmlFor="first_name">
          First Name:{" "}
        </label>
        <input
          className="first-name-color"
          id="first_name"
          name="first_name"
          onChange={formik.handleChange}
          value={formik.values.first_name}
        />
        <p className="error-message-1"> {formik.errors.first_name}</p>
        <label className="last_name" htmlFor="last_name">
          Last Name:{" "}
        </label>
        <input
          className="last-name-color"
          id="last_name"
          name="last_name"
          onChange={formik.handleChange}
          value={formik.values.last_name}
        />
        <p className="error-message-1"> {formik.errors.last_name}</p>
        <label className="password" htmlFor="password_hash">
          Password:{" "}
        </label>
        <input
          className="password-color"
          id="password_hash"
          name="password_hash"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password_hash}
        />
        <p className="error-message-2"> {formik.errors.password_hash}</p>
        <br />
        <button className="login" type="submit">
          {loginType ? "Create Account" : "Login"}
          {console.log("login")}
        </button>
      </form>
    </div>
  );
};

export default Login;












// import React, { useEffect, useState } from "react";
// import { Formik, FormikConsumer, useFormik } from "formik";
// import { useHistory } from "react-router-dom";
// import * as yup from "yup";
// import Profile from "./Profile";

// const Login = ({ users, handleAddUser, handleLogin }) => {
//   const [loginType, setLoginType] = useState(false);
//   const history = useHistory();
//   const formShema = yup.object().shape({
//     email: yup.string().required("First name is required").max(100),
//     first_name: yup.string().required("First name is required").max(20),
//     last_name: yup.string().required("Last name is required").max(20),
//     location_id: yup.string().required("Location is required").max(20),
//     password_hash: yup.string().required("Password is required").max(100),
//   });

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.status === 200) {
//         // Redirect to a dashboard or other page upon successful login
//         window.location.href = `/profile/${email}`;
//       } else {
//         // Handle login failure, display an error message, etc.
//         console.error("Login failed!!");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <input
//         type="text"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//       <div>
//         <h1>Create Account</h1>
//         <input
//           type="text"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="first_name"
//           placeholder="first_name"
//           value={first_name}
//           // onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="last_name"
//           placeholder="last_name"
//           value={last_name}
//           // onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="location"
//           placeholder="location"
//           value={location_id}
//           // onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// };

// export default Login;
