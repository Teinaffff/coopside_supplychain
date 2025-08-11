import Companies from "../../pages/agent/companies/page";
import Dashboard from "../../pages/agent/home/Dashboard";
import Reports from "../../pages/agent/reports/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "companies",
    title: "Companies",
    element: <Companies />,
  },
  {
    path: "reports",
    title: "Reports",
    element: <Reports />,
  },
];
