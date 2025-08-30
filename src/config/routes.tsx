
import PageNotFound from "../common/components/PageNotFound";
import Admin from "../pages/admin";
import Login from "../pages/auth/Login";
import Landing from "../pages/landing";
import { ROLES } from "./permissions";

export const appRoutes = [
  {
    path: "/",
    element: <Landing />,
    roles: null,
  },
  {
    path: "/admin/*",
    element: <Admin />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "/login",
    element: <Login />,
    roles: null,
  },
  {
    path: "/not-found",
    element: <PageNotFound />,
    roles: null,
  },
];
