import Dashboard from "../pages/home/Dashboard";
import UsersPage from "../pages/users/page";

export const ROUTES = [
  {
    path: "/",
    title: "Dashboard",
    element: <Dashboard />,
  },
  {
    path: "/users",
    title: "Users",
    element: <UsersPage />,
  },
];
