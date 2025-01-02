import Dashboard from "../pages/home/Dashboard";
import UsersPage from "../pages/users/page";

export const ROUTES = [
  {
    path: "/dashboard",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "/members",
    title: "Members",
    element: <UsersPage />,
  },
];
