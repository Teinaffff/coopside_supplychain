import ApplicationPage from "../../pages/pc/application";
import Dashboard from "../../pages/pc/home/Dashboard";
import UsersPage from "../../pages/pc/members";
import ProfilePage from "../../pages/pc/profile";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "application",
    title: "Application",
    element: <ApplicationPage />,
  },
  {
    path: "members",
    title: "Members",
    element: <UsersPage />,
  },
  {
    path: "share",
    title: "Share",
    element: <UsersPage />,
  },
  {
    path: "leadership",
    title: "Leadership",
    element: <UsersPage />,
  },
  {
    path: "profit",
    title: "Profit",
    element: <UsersPage />,
  },
  {
    path: "help-support",
    title: "Help & Support",
    element: <UsersPage />,
  },
  {
    path: "profile",
    title: "Profile",
    element: <ProfilePage />,
  },
];
