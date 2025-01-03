import Dashboard from "../../pages/union/home/Dashboard";
import UsersPage from "../../pages/union/members/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "members",
    title: "Members",
    element: <UsersPage />,
  },
];
