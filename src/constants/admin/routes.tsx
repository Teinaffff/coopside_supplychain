import Dashboard from "../../pages/admin/home/Dashboard";
import Agents from "../../pages/admin/agents/page";
import Consumers from "../../pages/admin/consumers/page";
import PC from "../../pages/admin/pc/page";
import Reports from "../../pages/admin/reports/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "agents",
    title: "Agents",
    element: <Agents />,
  },
  {
    path: "consumers",
    title: "Consumers",
    element: <Consumers />,
  },
  {
    path: "pc",
    title: "Primary Cooperatives",
    element: <PC />,
  },
  {
    path: "reports",
    title: "Reports",
    element: <Reports />,
  },
];
