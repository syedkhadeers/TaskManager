import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import { commonRoutes } from "./routes/commonRoutes";
import { formRoutes } from "./routes/formRoutes";
import { roomRoutes } from "./routes/roomRoutes";

const App = () => {
  return (
    <div className="w-full min-h-screen">
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {commonRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              {authRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              {userRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              {formRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              {roomRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  style: {
                    background: "green",
                    color: "white",
                    fontWeight: "bold",
                    timeout: 3000,
                  },
                },
                error: {
                  style: {
                    background: "red",
                    color: "white",
                    fontWeight: "bold",
                    timeout: 3000,
                  },
                },
                warn: {
                  style: {
                    background: "orange",
                    color: "white",
                    fontWeight: "bold",
                    timeout: 3000,
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