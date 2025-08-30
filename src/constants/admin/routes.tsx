import AgentDetails from "../../pages/admin/agents/components/AgentDetails";
import Agents from "../../pages/admin/agents/page";
import ConsumerDetails from "../../pages/admin/consumers/components/ConsumerDetails";
import Consumers from "../../pages/admin/consumers/page";
import Dashboard from "../../pages/admin/home/Dashboard";
import InstitutionDetails from "../../pages/admin/institutions/components/InstitutionDetails";
import Institutions from "../../pages/admin/institutions/page";
import Logs from "../../pages/admin/logs/page";
import FactoryDetails from "../../pages/admin/manufacturies/components/FactoryDetails";
import Manufacturies from "../../pages/admin/manufacturies/page";
import SellerDetails from "../../pages/admin/seller/components/SellerDetails";
import Seller from "../../pages/admin/seller/page";
import UsersPage from "../../pages/admin/users/page";
import Orders from "../../pages/admin/orders/page";
import OrderDetails from "../../pages/admin/orders/components/OrderDetails";
import Loans from "../../pages/admin/loans/page";
import LoanDetails from "../../pages/admin/loans/components/LoanDetails";
import { ROLES } from "../../config/permissions";
// import Payments from "../../pages/admin/payments/page";
// import PaymentDetails from "../../pages/admin/payments/components/PaymentDetails";
// import Transactions from "../../pages/admin/transactions/page";
// import TransactionDetails from "../../pages/admin/transactions/components/TransactionDetails";
// import Products from "../../pages/admin/products/page";
// import ProductDetails from "../../pages/admin/products/components/ProductDetails";
// import Requests from "../../pages/admin/requests/page";
// import RequestDetails from "../../pages/admin/requests/components/RequestDetails";
// import Reports from "../../pages/admin/reports/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
    roles: [ROLES.ADMIN],
  },

  // User Management Routes
  {
    path: "Seller",
    title: "Primary Cooperatives",
    element: <Seller />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "sellers/:id",
    title: "Seller Details",
    element: <SellerDetails />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "agents",
    title: "Agents",
    element: <Agents />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "agents/:id",
    title: "Agents Details",
    element: <AgentDetails />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "factories",
    title: "Factories",
    element: <Manufacturies />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "factories/:id",
    title: "Factory Details",
    element: <FactoryDetails />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "institutions",
    title: "Institutions",
    element: <Institutions />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "institutions/:id",
    title: "Institution Details",
    element: <InstitutionDetails />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "consumers",
    title: "Consumers",
    element: <Consumers />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "consumers/:id",
    title: "Consumer Details",
    element: <ConsumerDetails />,
    roles: [ROLES.ADMIN],
  },

  // Financial Management Routes
  {
    path: "loans",
    title: "Loans",
    element: <Loans />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "loans/:id",
    title: "Loan Details",
    element: <LoanDetails />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   path: "payments",
  //   title: "Payments",
  //   element: <Payments />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   path: "payments/:id",
  //   title: "Payment Details",
  //   element: <PaymentDetails />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   path: "transactions",
  //   title: "Transactions",
  //   element: <Transactions />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   path: "transactions/:id",
  //   title: "Transaction Details",
  //   element: <TransactionDetails />,
  //  roles: [ROLES.ADMIN],
  // },

  // Supply Chain Management Routes
  {
    path: "orders",
    title: "Orders",
    element: <Orders />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "orders/:id",
    title: "Order Details",
    element: <OrderDetails />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   path: "products",
  //   title: "Products",
  //   element: <Products />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   path: "products/:id",
  //   title: "Product Details",
  //   element: <ProductDetails />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   path: "requests",
  //   title: "Requests",
  //   element: <Requests />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   path: "requests/:id",
  //   title: "Request Details",
  //   element: <RequestDetails />,
  //  roles: [ROLES.ADMIN],
  // },

  // System Management Routes
  {
    path: "users",
    title: "Users",
    element: <UsersPage />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   path: "reports",
  //   title: "Reports",
  //   element: <Reports />,
  //  roles: [ROLES.ADMIN],
  // },
  {
    path: "logs",
    title: "Logs",
    element: <Logs />,
    roles: [ROLES.ADMIN],
  },
];
