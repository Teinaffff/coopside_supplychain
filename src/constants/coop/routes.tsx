import Dashboard from "../../pages/coop/home/Dashboard";
import Requests from "../../pages/coop/requests/page";
import Reports from "../../pages/coop/reports/page";
import Credit from "../../pages/coop/credit/page";
import Loan from "../../pages/coop/loan/page";
import CardManagement from "../../pages/coop/card/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "credit",
    title: "Credit Application",
    element: <Credit />,
  },
  {
    path: "loan",
    title: "Loan Management",
    element: <Loan />,
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
  {
    path: "card",
    title: "Card Management",
    element: <CardManagement />,
  },
];
