import AgentDetails from "../../pages/admin/agents/components/AgentDetails";
import Agents from "../../pages/admin/agents/page";
import Consumers from "../../pages/admin/consumers/page";
import Dashboard from "../../pages/admin/home/Dashboard";
import Institutions from "../../pages/admin/institutions/page";
import Logs from "../../pages/admin/logs/page";
import FactoryDetails from "../../pages/admin/manufacturies/components/FactoryDetails";
import Manufacturies from "../../pages/admin/manufacturies/page";
import Reports from "../../pages/admin/reports/page";
import Seller from "../../pages/admin/seller/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "Seller",
    title: "Primary Cooperatives",
    element: <Seller />,
  },
  {
    path: "agents",
    title: "Agents",
    element: <Agents />,
  },
  {
    path: "agents/:id",
    title: "Agents Details",
    element: <AgentDetails />,
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
    path: "factories",
    title: "Factories",
    element: <Manufacturies />,
  },
  {
    path: "factories/:id",
    title: "Factory Details",
    element: <FactoryDetails />,
  },
  {
    path: "reports",
    title: "Reports",
    element: <Reports />,
  },
  {
    path: "logs",
    title: "Logs",
    element: <Logs />,
  },
];
