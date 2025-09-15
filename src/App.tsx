import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import RequireAuth from "./pages/auth/RequireAuth";
import Coop from "./pages/coop";

function App() {
  return (
    <Routes>
      {/* Public Route: Login as landing page */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth allowedRoles={"admin"} />}>
        <Route element={<Layout />}>
          <Route path="/coop/*" element={<Coop />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
