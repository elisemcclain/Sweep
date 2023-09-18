import { useParams, useHistory } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useInsertionEffect } from "react";

function Profile({ setCurrentUser, currentUser }) {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetch("/currentUserPy", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch user data");
        }
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // Optionally, you can set an error state here if needed.
      });
  }, []);

  const handleEditProfile = () => {
    // Implement logic to navigate to the edit profile page or form
    // You can use React Router for navigation
    history.push("/edit-profile");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch("/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (response.status === 204) {
            history.push("/signup");
          } else {
            console.error("Error deleting account:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleLogout = () => {
    fetch("/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 204) {
          history.push("/login");
        } else {
          console.error("Error logging out:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="profile-container">
      <h1>hi</h1>
      {user && (
        <div>
          <h2>
            Welcome, {user.first_name} {user.last_name}
          </h2>
          <p>Email: {user.email}</p>
          <button onClick={handleEditProfile}>Edit Profile</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Profile;

//   users,
//   setUsers,
//   currentUser,
//   handleChangeUser,
//   handleDeleteUser,
// }) {
//   const [edit, setEdit] = useState(false);
//   const { id, first_name, last_name, email, address } = useParams();
//   const [userMatch, setUserMatch] = useState(false);
//   const history = useHistory();
//   const formSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     first_name: Yup.string().required("First Name is required"),
//     last_name: Yup.string().required("Last Name is required"),
//     address: Yup.string().required("Address is required"),
//   });

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch(
//         `http://127.0.0.1:5555/users/${currentUser.id}`
//       );
//       const cUserArray = await response.json();
//       setUsers(cUserArray);
//     };
//     fetchUsers().catch(console.error);
//   }, [currentUser]);

//   const formik = useFormik({
//     initialValues: {
//       id: currentUser.id,
//       email: currentUser.email || "",
//       first_name: currentUser.first_name || "",
//       last_name: currentUser.last_name || "",
//       address: currentUser.address || "",
//       password: "",
//     },
//     validationSchema: formSchema,
//     onSubmit: async (values) => {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5555/users/${currentUser.id}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//             body: JSON.stringify(values),
//           }
//         );
//         if (response.status === 200) {
//           const updatedUserData = await response.json();
//           handleChangeUser(updatedUserData);
//         } else {
//           console.error("Error updating user:", response.status);
//         }
//       } catch (error) {
//         console.error("Error updating user:", error);
//       } finally {
//         setEdit(!edit);
//       }
//     },
//   });

//   const EditProfile = async () => {
//     if (edit) {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5555/user/${currentUser.id}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               user_id: currentUser.id,
//               first_name: formik.values.first_name, // Include edited first name
//               last_name: formik.values.last_name, // Include edited last name
//               address: formik.values.address, // Include edited address
//               password: formik.values.password,
//             }),
//           }
//         );

//         if (response.status === 202) {
//           const updatedUserData = await response.json();
//           handleChangeUser(updatedUserData);
//         } else {
//           console.error("Error updating user:", response.status);
//         }
//       } catch (error) {
//         console.error("Error updating user:", error);
//       }
//     } else {
//       setEdit(!edit);
//     }
//   };

//   const logout = async () => {
//     try {
//       const response = await fetch("/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         // body: JSON.stringify(values),
//       });

//       if (response.status === 200) {
//       } else {
//         console.error("Logout failed:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           <h1 className="account">PROFILE</h1>
//         </div>
//       </div>
//       <div className="bar-user"></div>
//       {currentUser ? (
//         <div>
//           <div className="edit-prof-button custom-edit-button-move">
//             <button
//               type="button"
//               onClick={EditProfile}
//               className="edit-prof-button custom-edit-button"
//             >
//               {edit ? "Cancel" : "Edit Profile"}
//             </button>
//           </div>
//           <div className="bar-background">
//             {edit ? (
//               <div>
//                 <form onSubmit={formik.handleSubmit}>
//                   <br />
//                   <div>
//                     <label>Email</label>
//                     <input
//                       type="email"
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       {...formik.getFieldProps("email")}
//                     />
//                     {formik.touched.email && formik.errors.email ? (
//                       <div>{formik.errors.email}</div>
//                     ) : null}
//                   </div>
//                   <br />
//                   <div>
//                     <label>First Name</label>
//                     <input
//                       type="text"
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       {...formik.getFieldProps("first_name")}
//                     />
//                     {formik.touched.first_name && formik.errors.first_name ? (
//                       <div>{formik.errors.first_name}</div>
//                     ) : null}
//                   </div>
//                   <br />
//                   <div>
//                     <label>Last Name</label>
//                     <input
//                       type="text"
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       {...formik.getFieldProps("last_name")}
//                     />
//                     {formik.touched.last_name && formik.errors.last_name ? (
//                       <div>{formik.errors.last_name}</div>
//                     ) : null}
//                   </div>
//                   <br />
//                   <div>
//                     <label>Address</label>
//                     <input
//                       type="text"
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       {...formik.getFieldProps("address")}
//                     />
//                     {formik.touched.address && formik.errors.address ? (
//                       <div>{formik.errors.address}</div>
//                     ) : null}
//                   </div>
//                   <br />
//                   <div>
//                     <label>Password</label>
//                     <input
//                       type="password"
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       {...formik.getFieldProps("password")}
//                     />
//                     {formik.touched.password && formik.errors.password ? (
//                       <div>{formik.errors.password}</div>
//                     ) : null}
//                   </div>
//                   <br />
//                   <div>
//                     <button type="submit">Save Profile</button>
//                   </div>
//                 </form>
//               </div>
//             ) : (
//               <div>
//                 <h3>First Name: {currentUser.first_name}</h3>
//                 <h3>Last Name: {currentUser.last_name}</h3>
//                 <h3>Email: {currentUser.email}</h3>
//                 <h4>Address: {currentUser.address}</h4>
//               </div>
//             )}
//             <div>
//               <button onClick={logout}>Logout</button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <h2>Not Logged in as the current user at this path</h2>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;
