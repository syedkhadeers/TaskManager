import ExtraServicesPage from "../pages/room/ExtraServicesPage";
import PrivateRoute from "../components/common/PrivateRoute";
import TimeSlotsPage from "../pages/room/TimeSlotsPage";
import RoomTypesPage from "../pages/room/RoomTypesPage";
import RoomsPage from "../pages/room/RoomsPage";


export const roomRoutes = [
  {
    path: "/extra-services",
    element: <PrivateRoute element={<ExtraServicesPage />} />,
  },
  {
    path: "/time-slots",
    element: <PrivateRoute element={<TimeSlotsPage />} />,
  },
  {
    path: "/room-types",
    element: <PrivateRoute element={<RoomTypesPage />} />,
  },
  {
    path: "/rooms",
    element: <PrivateRoute element={<RoomsPage />} />,
  },
];
