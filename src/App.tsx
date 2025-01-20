import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import RequireAuth from "./pages/auth/RequireAuth";
import Landing from "./pages/landing";
import PC from "./pages/pc";
import Union from "./pages/union";
import SignupPage from "./pages/auth/Signup";
import PageNotFound from "./common/PageNotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Landing />} />

        <Route element={<RequireAuth allowedRoles={"admin"} />}>
          <Route path="/pc/*" element={<PC />} />
          <Route path="/union/*" element={<Union />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
