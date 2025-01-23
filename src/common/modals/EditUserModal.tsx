import { useState } from "react";
// import { useDispatch } from 'react-redux';
import UserForm from "../../components/UserForm";
import { useEditUserModal } from "../../hooks/use-edit-user-modal";
import { Modal } from "../ui/modal";
import { useAppDispatch } from "../../store";
import { updateUsersData } from "../../store/pc/user/user-extra";
import { User } from "../../constants/interface/pc/members";

export const EditUserModal = () => {
  const { isOpen, onClose, defaultValues } = useEditUserModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: User) => {
    try {
      setLoading(true);
      console.log("object: ", data);
      dispatch(updateUsersData(data));
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
        <UserForm
          defaultValues={
            defaultValues || {
              _id: "",
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
