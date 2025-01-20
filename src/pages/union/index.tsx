import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import DefaultLayout from "../../layout/DefaultLayout";
import { menuItems } from "../../constants/union/menu";
import { ROUTES } from "../../constants/union/routes";
import { useAppDispatch } from "../../store";
import { getUsersData } from "../../store/pc/user/user-extra";
import { fetchNotificationsData } from "../../store/notification/notification-extra";
import PageNotFound from "../../common/PageNotFound";

const Union = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersData());
    dispatch(fetchNotificationsData());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout menuItems={menuItems} />}>
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
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Union;
