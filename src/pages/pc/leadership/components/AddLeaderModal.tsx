import { Modal } from "../../../../common/ui/modal";
import { AddEditLeader } from "../../../../constants/interface/pc/leadership";
import { useAddLeaderModal } from "../../../../hooks/use-add-leader-modal";
import LeaderForm from "./LeaderForm";
import { usePcLeadership } from "./use-pc-leadership";

export const AddLeaderModal = () => {
  const { isOpen, onClose, defaultValues } = useAddLeaderModal();
  const { loading, handleAddPcLeadership } = usePcLeadership();

  const handleSubmit = (data: AddEditLeader) => {
    handleAddPcLeadership(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Leader"
        description="Manage Leader Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[50%] lg:w-[35%] h-[90%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <LeaderForm
          defaultValues={
            defaultValues || {
              userId: undefined,
              role: "",
              board: "",
              date: new Date().toLocaleDateString("en-CA"),
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
