import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ user, children }) => {
  // only allow access if logged in
  return user ? children : <Navigate to="/login" />;
};

export const PublicRoute = ({ user, children }) => {
  // only allow access if NOT logged in
  return !user ? children : <Navigate to="/" />;
};