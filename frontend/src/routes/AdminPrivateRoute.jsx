import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const location = useLocation();

  //  Get JWT token
  const token = localStorage.getItem("token");

  // Safely retrieve and parse loggedInUser from localStorage
  let user = null;
  try {
    const rawUser = localStorage.getItem("loggedInUser");
    if (rawUser && rawUser !== "undefined") {
      user = JSON.parse(rawUser);
    }
  } catch (err) {
    console.warn("⚠️ Failed to parse loggedInUser:", err);
    user = null;
  }

  //  Confirm user is logged in and is an admin
  const isAdmin = token && user?.role === "admin";

  //  If not an admin, redirect to admin login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  //  If authorized, render the requested admin route
  return children;
};

export default AdminPrivateRoute;
