import Dashboard from "../../pages/pc/home/Dashboard";
import UsersPage from "../../pages/pc/members/page";

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
