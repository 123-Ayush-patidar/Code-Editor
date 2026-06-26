import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "../components/Registration";
import Dashboard from "../components/Dashboard";
import Editor from "../components/Editor";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../components/Profile";

const AppRoutes = () => {
  const isAuthenticated =
    localStorage.getItem("isAuthenticated");

  return (
    <Routes>
      {/* Login Page */}
      <Route
        path="/"
        element={
          isAuthenticated === "true"
            ? <Navigate to="/dashboard" replace />
            : <AuthPage />
        }
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Editor */}
      <Route
        path="/editor/:language"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />
       <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;