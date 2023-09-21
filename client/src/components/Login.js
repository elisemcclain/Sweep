import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "./UserProvider";

const Login = ({ setLoggedIn }) => {
  let user = useContext(UserContext);
  const history = useHistory();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      });

      if (response.status == 200) {
        history.push(`/profile/${user.first_name}`);
        setLoggedIn(true);
        console.log("success");
      } else {
        console.error("Login failed. Please check the problem.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
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

// const Login = ({ loggedIn, setLoggedIn }) => {
//   const history = useHistory();
//   let user = useContext(UserContext);
//   // const [loggedIn, setLoggedIn] = useState(false);
//   // let loggedIn = useContext(UserContext);
//   console.log(user);

//   const [userData, setUserData] = useState([]);

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const validationSchema = yup.object().shape({
//     email: yup.string().email("Invalid email address").required("Required"),
//     password: yup.string().required("Required"),
//   });

//   const onSubmit = async (values) => {
//     try {
//       const response = await fetch("http://127.0.0.1:5555/login", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values, null, 2),
//       });

//       if (response.status === 201) {
//         const data = await response.json();
//         history.push(`/profile/${user.first_name}`);
//         setLoggedIn(loggedIn);
//         console.log(loggedIn);
//         console.log(user);
//       } else {
//         console.error("Login failed. Please check the problem.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//     }
//   };

//   function handleChange() {
//     history.push("/signup");
//   }

//   return (
//     <div>
//       <h2>Login</h2>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         <Form>
//           <div>
//             <label>Email:</label>
//             <Field type="email" name="email" />
//             <ErrorMessage name="email" component="div" />
//           </div>
//           <div>
//             <label>Password:</label>
//             <Field type="password" name="password" />
//             <ErrorMessage name="password" component="div" />
//           </div>
//           <div>
//             <button type="submit">Login</button>
//           </div>
//         </Form>
//       </Formik>
//       <div>
//         <button onClick={handleChange} type="submit">
//           Signup
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;
