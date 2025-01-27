import ApplicationPage from "../../pages/pc/application";
import Dashboard from "../../pages/pc/home/Dashboard";
import LeadershipPage from "../../pages/pc/leadership";
import CertificatePage from "../../pages/pc/management/certificate";
import BankPage from "../../pages/pc/management/bank";
import LogoPage from "../../pages/pc/management/logo";
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
    path: "management",
    title: "Management",
    element: <CertificatePage />,
  },
  {
    path: "management/bank",
    title: "Bank",
    element: <BankPage />,
  },
  {
    path: "management/logo",
    title: "Logo",
    element: <LogoPage />,
  },
  {
    path: "management/certificate",
    title: "Certificate",
    element: <CertificatePage />,
  },
  {
    path: "profile",
    title: "Profile",
    element: <ProfilePage />,
  },
];
