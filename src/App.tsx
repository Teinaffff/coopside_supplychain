import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import RequireAuth from "./pages/auth/RequireAuth";
import Landing from "./pages/landing";
import PC from "./pages/pc";
import Union from "./pages/union";
import SignupPage from "./pages/auth/Signup";
import PageNotFound from "./common/PageNotFound";
import Member from "./pages/member";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Landing />} />

        <Route element={<RequireAuth allowedRoles={"admin"} />}>
          <Route path="/pc/*" element={<PC />} /> 
          <Route path="/union/*" element={<Union />} />
          <Route path="/member/*" element={<Member />} />
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
