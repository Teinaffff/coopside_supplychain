import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";

type RequireAuthProps = {
  allowedRoles: string[] | null;
  children?: ReactNode;
};

const RequireAuth = ({ allowedRoles, children }: RequireAuthProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If user is not authenticated → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route does not require role restriction
  if (!allowedRoles) {
    return children ? <>{children}</> : <Outlet />;
  }

  // If authenticated but role not authorized → go to not-found
  return user?.userType && allowedRoles.includes(user.userType) ? (
    children ? (
      <>{children}</>
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/not-found" replace />
  );
};

export default RequireAuth;
