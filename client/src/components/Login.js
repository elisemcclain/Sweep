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
    address: yup.string().required("Address is required").max(20),
    password_hash: yup.string().required("Password is required").max(100),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      address: "",
      password_hash: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      console.log("Form submitted with values:");
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
        {loginType ? (
          <>
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
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
              <label className="address" htmlFor="address">
                Address:{" "}
              </label>
              <input
                className="address-color"
                id="address"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
              <p className="error-message-1"> {formik.errors.address}</p>
            </div>
            <div>
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
            </div>
          </>
        ) : (
          // Conditionally render additional fields
          <>
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
            <div>
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
            </div>
          </>
        )}
        <br />
        <button className="login" type="submit">
          {loginType ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

//   return (
//     <div>
//       <div>
//         <h1 className="welcome">WELCOME</h1>
//       </div>
//       <div className="greet">
//         Enter your email to log in or create an account
//       </div>
//       <div className="signup-move">
//         <button onClick={() => setLoginType(!loginType)} className="signup">
//           {loginType ? "Back to Login" : "Click to Create Account"}
//         </button>
//       </div>
//       <form onSubmit={formik.handleSubmit}>
//         <br />
//         <div>
//           <label className="email" htmlFor="email">
//             Email:{" "}
//           </label>
//           <input
//             className="email-color"
//             id="email"
//             name="email"
//             onChange={formik.handleChange}
//             value={formik.values.email}
//           />
//           <p className="error-message"> {formik.errors.email}</p>
//         </div>
//         <div>
//           <label className="password" htmlFor="password_hash">
//             Password:{" "}
//           </label>
//           <input
//             className="password-color"
//             id="password_hash"
//             name="password_hash"
//             type="password"
//             onChange={formik.handleChange}
//             value={formik.values.password_hash}
//           />
//           <p className="error-message-2"> {formik.errors.password_hash}</p>
//         </div>
//         {loginType ? null : ( // Conditionally render additional fields
//           <>
//             <div>
//               <label className="first_name" htmlFor="first_name">
//                 First Name:{" "}
//               </label>
//               <input
//                 className="first-name-color"
//                 id="first_name"
//                 name="first_name"
//                 onChange={formik.handleChange}
//                 value={formik.values.first_name}
//               />
//               <p className="error-message-1"> {formik.errors.first_name}</p>
//             </div>
//             <div>
//               <label className="last_name" htmlFor="last_name">
//                 Last Name:{" "}
//               </label>
//               <input
//                 className="last-name-color"
//                 id="last_name"
//                 name="last_name"
//                 onChange={formik.handleChange}
//                 value={formik.values.last_name}
//               />
//               <p className="error-message-1"> {formik.errors.last_name}</p>
//             </div>
//             <div>
//               <label className="address" htmlFor="address">
//                 Address:{" "}
//               </label>
//               <input
//                 className="address-color"
//                 id="address"
//                 name="address"
//                 onChange={formik.handleChange}
//                 value={formik.values.address}
//               />
//               <p className="error-message-1"> {formik.errors.address}</p>
//             </div>
//           </>
//         )}
//         <br />
//         <button className="login" type="submit">
//           {loginType ? "Create Account" : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
