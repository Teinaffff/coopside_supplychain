import Dashboard from "../../pages/coop/home/Dashboard";
import Requests from "../../pages/coop/requests/page";
import Reports from "../../pages/coop/reports/page";
import Credit from "../../pages/coop/credit/page";
import Loan from "../../pages/coop/loan/page";
import ApprovalManagementPage from "../../pages/coop/approval/page";
import InstitutionDetailsPage from "../../pages/coop/approval/InstitutionDetailsPage";
import ConsumerProfilePage from "../../pages/coop/approval/ConsumerProfilePage";
import UserManagementPage from "../../pages/coop/users/page";
import FactoryDetailsPage from "../../pages/coop/approval/components/FactoryDetailsPage";
import AgentDetailsPage from "../../pages/coop/approval/components/AgentDetailsPage";
import InstitutionDetailsPageNew from "../../pages/coop/approval/components/InstitutionDetailsPage";
import ConsumerListPage from "../../pages/coop/approval/components/ConsumerListPage";
import ConsumerDetailsPage from "../../pages/coop/approval/components/ConsumerDetailsPage";
import LoanMonitoringPage from "../../pages/coop/loan-monitoring/page";
import LoanDetailPage from "../../pages/coop/loan-monitoring/LoanDetailPage";
import DisbursementPage from "../../pages/coop/loan-monitoring/DisbursementPage";
import SettingsPage from "../../pages/coop/settings/page";
import LoanSettingsPage from "../../pages/coop/loan-monitoring/LoanSettingsPage";
import SystemUserRolesPage from "../../pages/coop/system/SystemUserRolesPage";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
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
    path: "approval/factories/:id",
    title: "Factory Details",
    element: <FactoryDetailsPage />,
  },
  {
    path: "approval/agents/:id",
    title: "Agent Details",
    element: <AgentDetailsPage />,
  },
  {
    path: "approval/institutions/:id",
    title: "Institution Details",
    element: <InstitutionDetailsPageNew />,
  },
  {
    path: "approval/institutions/:id/consumers",
    title: "Consumer List",
    element: <ConsumerListPage />,
  },
  {
    path: "approval/consumers/:id",
    title: "Consumer Details",
    element: <ConsumerDetailsPage />,
  },
  {
    path: "loan-monitoring",
    title: "Loan Monitoring",
    element: <LoanMonitoringPage />,
  },
  {
    path: "loan-monitoring/requests",
    title: "Loan Requests",
    element: <LoanMonitoringPage />,
  },
  {
    path: "loan-monitoring/:id",
    title: "Loan Details",
    element: <LoanDetailPage />,
  },
  {
    path: "loan-monitoring/disbursement",
    title: "Disbursement",
    element: <DisbursementPage />,
  },
  {
    path: "loan-monitoring/settings",
    title: "Loan Settings",
    element: <LoanSettingsPage />,
  },
  {
    path: "settings",
    title: "Settings",
    element: <SettingsPage />,
  },
  {
    path: "system/user-roles",
    title: "System User & Roles",
    element: <SystemUserRolesPage />,
  }
];
