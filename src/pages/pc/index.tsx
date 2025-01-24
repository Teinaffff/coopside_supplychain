import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { ROUTES } from "../../constants/pc/routes";
import DefaultLayout from "../../layout/DefaultLayout";
import { menuItems } from "../../constants/pc/menu";
import { useAppDispatch } from "../../store";
import { getUsersData } from "../../store/pc/user/user-extra";
import { fetchNotificationsData } from "../../store/notification/notification-extra";
import PageNotFound from "../../common/PageNotFound";
import { CalculateCompletion } from "../../hooks/use-calculate-profile";
import { profileMockData } from "../../common/data/data";
import { ProfileCompletionModal } from "./profile/components/ProfileCompletionModal";
import { useProfileCompletionModal } from "../../hooks/use-profile-completion-modal";

const PC = () => {
  const dispatch = useAppDispatch();
  const profileCompletionModal = useProfileCompletionModal();

  const profileCompletion = CalculateCompletion(profileMockData);
  console.log("profileCompletion: ", profileCompletion);

  useEffect(() => {
    dispatch(getUsersData());
    dispatch(fetchNotificationsData());

    const isNotCompleted = profileCompletion < 100;
    if (isNotCompleted) {
      profileCompletionModal.onOpen();
    } else {
      profileCompletionModal.onClose();
    }
  }, []);

  return (
    <DefaultLayout menuItems={menuItems}>
      <ProfileCompletionModal
        route={"/pc/profile"}
        message={
          "Completing the profile helps Commissioner to understand your primary cooperative and experience better and initiate license as soon as possible"
        }
      />
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

export default PC;
