// src/routes/user.jsx
import UsersPage from "../pages/user/UsersPage";
import AddUsersPage from "../pages/user/AddUsersPage";
import ViewUserPage from "../pages/user/ViewUserPage";
import ViewMePage from "../pages/user/ViewMePage";
import PrivateRoute from "../components/common/PrivateRoute";

export const userRoutes = [
  {
    path: "/users",
    element: <PrivateRoute element={<UsersPage />} />,
  },
  {
    path: "/users/add",
    element: <PrivateRoute element={<AddUsersPage />} />,
  },
  {
    path: "/users/view/:id",
    element: <PrivateRoute element={<ViewUserPage />} />,
  },
  {
    path: "/me",
    element: <PrivateRoute element={<ViewMePage />} />,
  },

];
