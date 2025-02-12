import SharesPage from "../../pages/member/shares/page";
import Dashboard from "../../pages/member/home/Dashboard";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "shares",
    title: "Shares",
    element: <SharesPage />,
  },
];
