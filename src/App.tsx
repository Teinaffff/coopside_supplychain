import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import RequireAuth from "./pages/auth/RequireAuth";
import Landing from "./pages/landing";
import PC from "./pages/pc";
import Admin from "./pages/admin";
import SignupPage from "./pages/auth/Signup";
import PageNotFound from "./common/PageNotFound";
import Agent from "./pages/agent";
import Coop from "./pages/coop";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Landing />} />

        <Route element={<RequireAuth allowedRoles={"admin"} />}>
          <Route path="/pc/*" element={<PC />} /> 
          <Route path="/admin/*" element={<Admin />} /> 
          <Route path="/agent/*" element={<Agent />} />
          <Route path="/coop/*" element={<Coop />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/not-found" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
