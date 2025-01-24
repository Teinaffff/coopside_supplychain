import { useState } from "react";
import { Modal } from "../../../../common/ui/modal";
import { User } from "../../../../constants/interface/pc/members";
import { useEditLeaderModal } from "../../../../hooks/use-edit-leader-modal";
import { useAppDispatch } from "../../../../store";
import MemberForm from "./LeaderForm";

export const EditLeaderModal = () => {
  const { isOpen, onClose, defaultValues } = useEditLeaderModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: User) => {
    try {
      setLoading(true);
      console.log("object: ", data);
      // dispatch(updateUsersData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    onClose();
  };
  console.log("default: ", defaultValues);

  return (
    <div>
      <Modal
        title="Update Member"
        description="Manage Member Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[70%] lg:w-[40%] h-[50%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <MemberForm
          defaultValues={
            defaultValues || {
              _id: -1,
              name: "",
              email: "",
              age: 0,
              nationality: "",
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
