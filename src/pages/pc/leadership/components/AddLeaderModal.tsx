import { useState } from "react";
import { Modal } from "../../../../common/ui/modal";
import { AddEditLeader } from "../../../../constants/interface/pc/leadership";
import { useAddLeaderModal } from "../../../../hooks/use-add-leader-modal";
import { useAppDispatch } from "../../../../store";
import LeaderForm from "./LeaderForm";

export const AddLeaderModal = () => {
  const { isOpen, onClose, defaultValues } = useAddLeaderModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: AddEditLeader) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(createUserData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
