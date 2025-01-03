import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { ROUTES } from "../../constants/pc/routes";
import DefaultLayout from "../../layout/DefaultLayout";
import { menuItems } from "../../constants/pc/menu";
import { useAppDispatch } from "../../store";
import { getUsersData } from "../../store/pc/user/user-extra";
import { fetchNotificationsData } from "../../store/notification/notification-extra";

const PC = () => {
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
      </Routes>
    </DefaultLayout>
  );
};

export default PC;
