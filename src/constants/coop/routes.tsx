import Dashboard from "../../pages/coop/home/Dashboard";
import Requests from "../../pages/coop/requests/page";
import Reports from "../../pages/coop/reports/page";
import Credit from "../../pages/coop/credit/page";
import Loan from "../../pages/coop/loan/page";
import ApprovalManagementPage from "../../pages/coop/approval/page";
import InstitutionDetailsPage from "../../pages/coop/approval/InstitutionDetailsPage";
import ConsumerProfilePage from "../../pages/coop/approval/ConsumerProfilePage";
import CreditProductManagement from "../../pages/coop/credit-products/page";
import TermsConditionsPage from "../../pages/coop/terms-conditions/page";
import UserManagementPage from "../../pages/coop/users/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
  },
  {
    path: "credit-products",
    title: "Product Management",
    element: <CreditProductManagement />,
  },
  {
    path: "terms-conditions",
    title: "Terms and Conditions",
    element: <TermsConditionsPage />,
  },
  {
    path: "users",
    title: "User Management",
    element: <UserManagementPage />,
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
  // {
  //   path: "card",
  //   title: "Card Management",
  //   element: <CardManagement />,
  // },
  {
    path: "approval",
    title: "Approval Management",
    element: <ApprovalManagementPage />,
  },
  {
    path: "approval/institutions/:id",
    title: "Institution Details",
    element: <InstitutionDetailsPage />,
  },
  {
    path: "approval/consumers/:id",
    title: "Consumer Profile",
    element: <ConsumerProfilePage />,
  }
];
