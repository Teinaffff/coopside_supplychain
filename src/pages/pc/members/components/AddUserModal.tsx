import { useState } from "react";
import { useDispatch } from "react-redux";
import AddUserForm from "../../../../components/AddUserForm";
import { useAddUserModal } from "../../../../hooks/use-add-user-modal";
import { Modal } from "../../../../common/ui/modal";
import { createUserData } from "../../../../store/pc/user/user-extra";
import { User } from "../../../../constants/interface/pc/members";

export const AddUserModal = () => {
  const { isOpen, onClose, defaultValues } = useAddUserModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (data: User) => {
    try {
      setLoading(true);
      console.log(data);
      dispatch(createUserData(data) as any);
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
        title="Create Members"
        description="Manage Members Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[70%] lg:w-[40%] h-[90%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <AddUserForm
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
