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
  },
  
  // User Management Routes
  {
    path: "Seller",
    title: "Primary Cooperatives",
    element: <Seller />,
  },
  {
    path: "sellers/:id",
    title: "Seller Details",
    element: <SellerDetails />,
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
    path: "institutions",
    title: "Institutions",
    element: <Institutions />,
  },
  {
    path: "institutions/:id",
    title: "Institution Details",
    element: <InstitutionDetails />,
  },
  {
    path: "consumers",
    title: "Consumers",
    element: <Consumers />,
  },
  {
    path: "consumers/:id",
    title: "Consumer Details",
    element: <ConsumerDetails />,
  },
  
  // Financial Management Routes
  {
    path: "loans",
    title: "Loans",
    element: <Loans />,
  },
  {
    path: "loans/:id",
    title: "Loan Details",
    element: <LoanDetails />,
  },
  // {
  //   path: "payments",
  //   title: "Payments",
  //   element: <Payments />,
  // },
  // {
  //   path: "payments/:id",
  //   title: "Payment Details",
  //   element: <PaymentDetails />,
  // },
  // {
  //   path: "transactions",
  //   title: "Transactions",
  //   element: <Transactions />,
  // },
  // {
  //   path: "transactions/:id",
  //   title: "Transaction Details",
  //   element: <TransactionDetails />,
  // },
  
  // Supply Chain Management Routes
  {
    path: "orders",
    title: "Orders",
    element: <Orders />,
  },
  {
    path: "orders/:id",
    title: "Order Details",
    element: <OrderDetails />,
  },
  // {
  //   path: "products",
  //   title: "Products",
  //   element: <Products />,
  // },
  // {
  //   path: "products/:id",
  //   title: "Product Details",
  //   element: <ProductDetails />,
  // },
  // {
  //   path: "requests",
  //   title: "Requests",
  //   element: <Requests />,
  // },
  // {
  //   path: "requests/:id",
  //   title: "Request Details",
  //   element: <RequestDetails />,
  // },
  
  // System Management Routes
  {
    path: "users",
    title: "Users",
    element: <UsersPage />,
  },
  // {
  //   path: "reports",
  //   title: "Reports",
  //   element: <Reports />,
  // },
  {
    path: "logs",
    title: "Logs",
    element: <Logs />,
  },
];
