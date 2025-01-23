import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileAvatarProgress from "../../components/ProfileAvatarProgress";
import { useProfileCompletionModal } from "../../hooks/use-profile-completion-modal";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

export const ProfileCompletionModal = ({
  route,
  message,
}: {
  route: string;
  message: string;
}) => {
  const navigate = useNavigate();
  const profileCompletionModal = useProfileCompletionModal();

  const handleCompleteNow = () => {
    navigate(route);
    profileCompletionModal.onClose();
  };

  return (
    <Modal
      title="Complete Your Profile"
      description=""
      isOpen={profileCompletionModal.isOpen}
      onClose={profileCompletionModal.onClose}
    >
      <div className="spaye-y-4 py-2 pb-4 w-72 flex flex-col justify-center items-center gap-2">
        <ProfileAvatarProgress />
        <div className="flex relative bg-slate-100 rounded-lg">
          <Info size={16} className="absolute top-2 left-2" />
          <p className="text-xs text-justify py-4 pl-7 pr-2">{message}</p>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={profileCompletionModal.onClose}
          >
            Skip For Now
          </Button>
          <Button
            size={"sm"}
            className="bg-cyan-500 hover:bg-cyan-500"
            onClick={handleCompleteNow}
          >
            Complete Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
