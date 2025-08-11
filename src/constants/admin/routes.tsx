import Agents from "../../pages/admin/agents/page";
import Consumers from "../../pages/admin/consumers/page";
import Dashboard from "../../pages/admin/home/Dashboard";
import Institutions from "../../pages/admin/institutions/page";
import Manufacturies from "../../pages/admin/manufacturies/page";
import PC from "../../pages/admin/pc/page";
import Reports from "../../pages/admin/reports/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "pc",
    title: "Primary Cooperatives",
    element: <PC />,
  },
  {
    path: "agents",
    title: "Agents",
    element: <Agents />,
  },
  {
    path: "institutions",
    title: "Institutions",
    element: <Institutions />,
  },
  {
    path: "consumers",
    title: "Consumers",
    element: <Consumers />,
  },
  {
    path: "Manufacturies",
    title: "manufacturies",
    element: <Manufacturies />,
  },
  {
    path: "reports",
    title: "Reports",
    element: <Reports />,
  },
];
