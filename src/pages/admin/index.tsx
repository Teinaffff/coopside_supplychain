import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { menuItems } from "../../constants/admin/menu";
import { ROUTES } from "../../constants/admin/routes";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAppDispatch } from "../../store";
import { fetchNotificationsData } from "../../store/notification/notification-extra";
import RequireAuth from "../auth/RequireAuth";

const Admin = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotificationsData());
  }, []);

  return (
    <DefaultLayout menuItems={menuItems} rootPath="/admin">
      <Routes>
        {ROUTES.map(({ title, path, element, roles  }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <>
                <PageTitle title={`${title} - Admin Dashboard`} />
                <RequireAuth allowedRoles={roles}>{element}</RequireAuth>
              </>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </DefaultLayout>
  );
};

export default Admin;
