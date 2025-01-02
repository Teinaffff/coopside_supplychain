import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import { ROUTES } from "./constants/routes";
import { useAppDispatch } from "./store";
import { fetchNotificationsData } from "./store/notification/notification-extra";
import { getUsersData } from "./store/user/user-extra";
import RequireAuth from "./pages/auth/RequireAuth";
import Login from "./pages/auth/Login";
import Landing from "./pages/landing/Landing";
import Layout from "./layout/Layout";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersData());
    dispatch(fetchNotificationsData());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Landing />} />
        {ROUTES.map(({ title, path, element }, index) => (
          <Route element={<RequireAuth allowedRoles={"admin"} />}>
            <Route
              key={index}
              path={path}
              element={
                <>
                  <PageTitle title={`${title} - Admin Dashboard`} />
                  {element}
                </>
              }
            />
          </Route>
        ))}
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
