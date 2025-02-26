import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { profileMockData } from "../../common/data/data";
import PageTitle from "../../components/PageTitle";
import { menuItems } from "../../constants/pc/menu";
import { ROUTES } from "../../constants/pc/routes";
import { CalculateCompletion } from "../../hooks/use-calculate-profile";
import { useProfileCompletionModal } from "../../hooks/use-profile-completion-modal";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAppDispatch } from "../../store";
import { fetchNotificationsData } from "../../store/notification/notification-extra";
import { getMembersData } from "../../store/pc/member/member-extra";
import { ProfileCompletionModal } from "./profile/components/ProfileCompletionModal";

const PC = () => {
  const dispatch = useAppDispatch();
  const profileCompletionModal = useProfileCompletionModal();
  const location = useLocation();

  const profileCompletion = CalculateCompletion(profileMockData);
  console.log("profileCompletion: ", profileCompletion);

  useEffect(() => {
    dispatch(getMembersData());
    dispatch(fetchNotificationsData());

    const isNotCompleted = profileCompletion < 100;
    if (isNotCompleted && !location.pathname.includes("profile")) {
      profileCompletionModal.onOpen();
    } else {
      profileCompletionModal.onClose();
    }
  }, []);

  return (
    <DefaultLayout menuItems={menuItems} rootPath="/pc">
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
