import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { menuItems } from "../../constants/coop/menu";
import { ROUTES } from "../../constants/coop/routes";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAppDispatch } from "../../store";
import { fetchNotificationsData } from "../../store/notification/notification-extra";

const Coop = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotificationsData());
  }, []);

  return (
    <DefaultLayout menuItems={menuItems} rootPath="/coop">
      <Routes>
        {ROUTES.map(({ title, path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <>
                <PageTitle title={`${title} - Cooperative Dashboard`} />
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

export default Coop;
