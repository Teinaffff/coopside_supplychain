import { useState } from "react";
import { Modal } from "../../../../common/ui/modal";
import { User } from "../../../../constants/interface/pc/members";
import { useAddLeaderModal } from "../../../../hooks/use-add-leader-modal";
import { useAppDispatch } from "../../../../store";
import LeaderForm from "./LeaderForm";

export const AddLeaderModal = () => {
  const { isOpen, onClose, defaultValues } = useAddLeaderModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: User) => {
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
        className="z-[101] w-full sm:w-[70%] lg:w-[40%] h-[90%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <LeaderForm
          defaultValues={
            defaultValues || {
              name: "",
              email: "",
              nationality: "",
              age: 0,
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
