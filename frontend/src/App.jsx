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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const toastOptions = {
    success: {
      style: {
        background: "#10B981",
        color: "#FFFFFF",
        fontWeight: "500",
      },
      duration: 3000,
    },
    error: {
      style: {
        background: "#EF4444",
        color: "#FFFFFF",
        fontWeight: "500",
      },
      duration: 3000,
    },
    warning: {
      style: {
        background: "#F59E0B",
        color: "#FFFFFF",
        fontWeight: "500",
      },
      duration: 3000,
    },
    info: {
      style: {
        background: "#3B82F6",
        color: "#FFFFFF",
        fontWeight: "500",
      },
      duration: 3000,
    },
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
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;

// import { Routes, Route } from "react-router-dom";
// import Forbidden from "./pages/Forbidden";

// // // Inside your Routes component
// // <Routes>
// //   {/* Your other routes */}
// //   <Route path="/forbidden" element={<Forbidden />} />
// // </Routes>;

// const renderRoutes = (routes) => {
//   return routes.map((route) => (
//     <Route
//       key={route.path}
//       path={route.path}
//       element={
//         <ErrorBoundary>
//           <Suspense fallback={<LoadingSpinner />}>{route.element}</Suspense>
//         </ErrorBoundary>
//       }
//     />
//   ));
// };
