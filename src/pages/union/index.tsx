import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { menuItems } from "../../constants/union/menu";
import { ROUTES } from "../../constants/union/routes";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAppDispatch } from "../../store";
import { fetchNotificationsData } from "../../store/notification/notification-extra";
import { getUsersData } from "../../store/pc/user/user-extra";

const Union = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersData());
    dispatch(fetchNotificationsData());
  }, []);

  return (
    <DefaultLayout menuItems={menuItems}>
      <Routes>
        {ROUTES.map(({ title, path, element }, index) => (
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
        ))}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </DefaultLayout>
  );
};

export default Union;
