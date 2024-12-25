import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import { commonRoutes } from "./routes/commonRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";

const App = () => {
  const toastOptions = {
    success: { style: { background: "var(--color-accent)", color: "var(--color-primary)", fontWeight: "bold", }, duration: 3000, },
    error: { style: { background: "#ef4444", color: "var(--color-primary)", fontWeight: "bold", }, duration: 3000, },
    warning: { style: { background: "#f59e0b", color: "var(--color-primary)", fontWeight: "bold", }, duration: 3000, },
    info: { style: { background: "var(--color-accent)", color: "var(--color-primary)", fontWeight: "bold", }, duration: 3000, },
  };

  const renderRoutes = (routes) => {
    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>{route.element}</Suspense>
          </ErrorBoundary>
        }
      />
    ));
  };

  return (
    <div className="w-full min-h-screen bg-primary text-text transition-colors duration-200">
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {renderRoutes(commonRoutes)}
                  {renderRoutes(authRoutes)}
                  {renderRoutes(userRoutes)}
                  {renderRoutes(roomRoutes)}
                </Routes>
              </Suspense>
              <Toaster
                position="top-right"
                toastOptions={toastOptions}
                containerStyle={{
                  top: 40,
                }}
              />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
