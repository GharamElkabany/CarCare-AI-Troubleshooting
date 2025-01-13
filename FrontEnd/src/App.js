import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Diagnostics from "./Components/Diagnostics/Diagnostics";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Welcome from "./Components/Welcome/Welcome";
import Profile from "./Components/Profile/Profile";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import AdminUsers from "./Components/AdminUsers/AdminUsers";
import AdminFeedbacks from "./Components/AdminFeedbacks/AdminFeedbacks";
import NotFound from "./Components/NotFound/NotFound";
import AdminFaq from "./Components/AdminFaq/AdminFaq";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import VerifyEmail from "./Components/VerifyEmail/VerifyEmail";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";


function App() {
  const [auth, setAuth] = useState(false); // Default to logged out
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token && userRole) {
      setAuth(true);
      setRole(userRole);
    } else {
      setAuth(false);
      setRole("");
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    return auth ? children : <Navigate to="/login" replace />;
  };

  const RestrictedRoute = ({ children }) => {
    return !auth ? children : <Navigate to="/home" replace />;
  };

  const routers = createBrowserRouter([
    {
      path: "",
      element: <Layout role={role} />,
      children: [
        // Restricted pages for unauthenticated users
        { index: true, element: <RestrictedRoute><Welcome /></RestrictedRoute> },
        { path: "login", element: <RestrictedRoute><Login setAuth={setAuth} setRole={setRole} /></RestrictedRoute> },
        { path: "register", element: <RestrictedRoute><Register /></RestrictedRoute> },

        // Protected pages for authenticated users
        { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: "profile", element: <ProtectedRoute><Profile setAuth={setAuth} setRole={setRole} /></ProtectedRoute> },
        { path: "changePassword", element: <ProtectedRoute><ChangePassword /></ProtectedRoute> },
        { path: "diagnostics", element: <ProtectedRoute><Diagnostics /></ProtectedRoute> },
        { path: "adminUsers", element: role === "admin" ? <ProtectedRoute><AdminUsers /></ProtectedRoute> : <Navigate to="/home" replace /> },
        { path: "adminFeedbacks", element: role === "admin" ? <ProtectedRoute><AdminFeedbacks /></ProtectedRoute> : <Navigate to="/home" replace /> },
        { path: "adminFaq", element: role === "admin" ? <ProtectedRoute><AdminFaq /></ProtectedRoute> : <Navigate to="/home" replace /> },
        { path: "adminDashboard", element: role === "admin" ? <ProtectedRoute><AdminDashboard /></ProtectedRoute> : <Navigate to="/home" replace /> },
        
        // Public route for email verification
        { path: "verify-email", element: <VerifyEmail /> },
        { path: "forgot-password", element: <ForgotPassword />},
        { path: "reset-password", element: <ResetPassword />},

        // Fallback for 404
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <div className="main-content" style={{ backgroundColor: "#76AB79" }}>
        <RouterProvider router={routers}></RouterProvider>
      </div>
    </>
  );
}

export default App;
