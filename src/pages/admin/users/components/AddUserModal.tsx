import { Modal } from "../../../../common/ui/modal";
import { AdminModuleType } from "../../../../constants/interface/admin/user";
import { UserFormValues } from "../../../../schema/admin/user";
import { useAddUserModal } from "../../hooks/use-add-user-modal";
import { useUsers } from "../../hooks/use-users";
import UserForm from "./UserForm";

export const AddUserModal = () => {
  const { isOpen, onClose } = useAddUserModal();
  const { handleAddUser, isAddUserLoading } = useUsers();

  const handleSubmit = async (data: UserFormValues) => {
    await handleAddUser(data);
  };

  const defaultValues: Partial<UserFormValues> = {
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    userType: AdminModuleType.WEB_ADMIN,
    isActive: true,
  };

  return (
    <Modal
      title="Add New User"
      description="Create a new admin user"
      isOpen={isOpen}
      onClose={onClose}
      className="z-[101] w-full sm:w-[80%] lg:w-[60%] h-[90%] sm:h-[550px] mt-5 overflow-y-scroll"
    >
      <UserForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={isAddUserLoading}
        onClose={onClose}
        buttonTitle="Create"
      />
    </Modal>
  );
};
