import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string }) => {
  const location = useLocation();
  // return roles === allowedRoles ? (
  return "admin" === allowedRoles ? (
    <Outlet />
  ) : "roles" === "roles" ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
