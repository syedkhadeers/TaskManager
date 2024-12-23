// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PrivateRoute from "./components/common/PrivateRoute";
import { Toaster } from "react-hot-toast";
import UsersPage from "./pages/UsersPage";
import AddUsersPage from "./pages/AddUsersPage";
import FormElements from "./pages/FormElements";
import FormElementBasic from "./pages/forms/FormElementBasic";
import FormElementIntermediate from "./pages/forms/FormElementIntermediate";
import FormElementAdvanced from "./pages/forms/FormElementAdvanced";
import ViewUserContent from "./components/users/VIewUserContent";
import ViewUserPage from "./pages/ViewUserPage";




const App = () => {
  return (
    <div className="w-full min-h-screen ">
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
              <Route path="/users" element={<PrivateRoute element={<UsersPage />} />} />
              <Route path="/users/add" element={<PrivateRoute element={<AddUsersPage />} />} />
              <Route path="/users/view/:id" element={<PrivateRoute element={<ViewUserPage />} />} />

              <Route path="/users" element={<PrivateRoute element={<UsersPage />} />} />
              <Route path="/form" element={<PrivateRoute element={<FormElements />} />} />
              <Route path="/form-elements/basic" element={<PrivateRoute element={<FormElementBasic />} />} />
              <Route path="/form-elements/intermediate" element={<PrivateRoute element={<FormElementIntermediate />} />} />
              <Route path="/form-elements/advanced" element={<PrivateRoute element={<FormElementAdvanced />} />} />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  style: {
                    background: "green",
                    color: "white",
                    fontWeight: "bold",
                    timeout: 3000, // 3 seconds
                  },
                },
                error: {
                  style: {
                    background: "red",
                    color: "white",
                    fontWeight: "bold",
                    timeout: 3000, // 3 seconds
                  },
                },
                warn: {
                  style: {
                    background: "orange",
                    color: "white",
                    fontWeight: "bold",
                    timeout: 3000, // 3 seconds
                  },
                },
              }}
            />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
};

export default App;

