import ApplicationPage from "../../pages/pc/application";
import Dashboard from "../../pages/pc/home/Dashboard";
import LeadershipPage from "../../pages/pc/leadership";
import UsersPage from "../../pages/pc/members";
import ProfilePage from "../../pages/pc/profile";
import ProfitPage from "../../pages/pc/profit";
import SharePage from "../../pages/pc/share";
import SupportPage from "../../pages/pc/support/indec";

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
    element: <SharePage />,
  },
  {
    path: "leadership",
    title: "Leadership",
    element: <LeadershipPage />,
  },
  {
    path: "profit",
    title: "Profit",
    element: <ProfitPage />,
  },
  {
    path: "help-support",
    title: "Help & Support",
    element: <SupportPage />,
  },
  {
    path: "profile",
    title: "Profile",
    element: <ProfilePage />,
  },
];
