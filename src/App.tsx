import { Navigate, Route, Routes } from "react-router-dom";
import { appRoutes } from "./config/routes";
import Layout from "./layout/Layout";
import RequireAuth from "./pages/auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {appRoutes.map(({ path, element, roles }) =>
          roles ? (
            <Route key={path} element={<RequireAuth allowedRoles={roles} />}>
              <Route path={path} element={element} />
            </Route>
          ) : (
            <Route key={path} path={path} element={element} />
          )
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
