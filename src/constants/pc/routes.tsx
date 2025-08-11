import Dashboard from "../../pages/pc/home/Dashboard";
import UsersPage from "../../pages/pc/members";
import MemberDetails from "../../pages/pc/members/components/MemberDetails";
import ProfilePage from "../../pages/pc/profile";

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
  {
    path: "members/:memberId",
    title: "Member Details",
    element: <MemberDetails />,
  },
  {
    path: "profile",
    title: "Profile",
    element: <ProfilePage />,
  },
];
