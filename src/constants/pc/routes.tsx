import ApplicationPage from "../../pages/pc/application";
import Dashboard from "../../pages/pc/home/Dashboard";
import LeadershipPage from "../../pages/pc/leadership";
import LicensePage from "../../pages/pc/license";
import BankPage from "../../pages/pc/bank";
import LogoPage from "../../pages/pc/logo";
import UsersPage from "../../pages/pc/members";
import ProfilePage from "../../pages/pc/profile";
import ProfitPage from "../../pages/pc/profit";
import SharePage from "../../pages/pc/share";

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
    path: "bank",
    title: "Bank",
    element: <BankPage />,
  },
  {
    path: "logo",
    title: "Logo",
    element: <LogoPage />,
  },
  {
    path: "license",
    title: "License",
    element: <LicensePage />,
  },
  {
    path: "profile",
    title: "Profile",
    element: <ProfilePage />,
  },
];
