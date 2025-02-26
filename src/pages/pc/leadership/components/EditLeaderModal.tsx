import { Modal } from "../../../../common/ui/modal";
import { AddEditLeader } from "../../../../constants/interface/pc/leadership";
import { useEditLeaderModal } from "../../../../hooks/use-edit-leader-modal";
import LeaderForm from "./LeaderForm";
import { usePcLeadership } from "./use-pc-leadership";

export const EditLeaderModal = () => {
  const { isOpen, onClose, defaultValues } = useEditLeaderModal();
  const { loading, handleEditPcLeadership } = usePcLeadership();

  const handleSubmit = (data: AddEditLeader) => {
    handleEditPcLeadership(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Update Leader"
        description="Manage Leader Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[50%] lg:w-[35%] h-[50%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <LeaderForm
          defaultValues={
            defaultValues || {
              _id: -1,
              userId: undefined,
              role: "",
              board: "",
              date: "",
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
