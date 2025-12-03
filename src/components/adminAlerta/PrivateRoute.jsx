import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return isLoggedIn === "true" ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
