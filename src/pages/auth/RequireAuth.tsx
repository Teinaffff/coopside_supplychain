import { Outlet } from "react-router-dom";

// Temporary RequireAuth that bypasses role checks until API is available
const RequireAuth = () => {
  return <Outlet />;
};

export default RequireAuth;
