// src/routes/user.jsx

import DashboardPage from "../pages/common/DashboardPage";
import PrivateRoute from "../components/common/PrivateRoute";
import LandingPage from "../pages/common/LandingPage";
import Forbidden from "../pages/common/forbiddenPage";

export const commonRoutes = [
  {
    path: "/dashboard",
    element: <PrivateRoute element={<DashboardPage />} />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  }
];
