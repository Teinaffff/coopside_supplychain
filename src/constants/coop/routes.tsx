import Dashboard from "../../pages/coop/home/Dashboard";
import Requests from "../../pages/coop/requests/page";
import Reports from "../../pages/coop/reports/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "requests",
    title: "Requests",
    element: <Requests />,
  },
  {
    path: "reports",
    title: "Reports",
    element: <Reports />,
  },
];
