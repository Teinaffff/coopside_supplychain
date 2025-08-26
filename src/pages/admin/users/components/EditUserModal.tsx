import { Modal } from "../../../../common/ui/modal";
import { UserFormValues } from "../../../../schema/admin/user";
import { useEditUserModal } from "../../hooks/use-edit-user-modal";
import { useUsers } from "../../hooks/use-users";
import UserForm from "./UserForm";

export const EditUserModal = () => {
  const { isOpen, onClose, user } = useEditUserModal();
  const { handleUpdateUser, isEditUserLoading } = useUsers();

  const handleSubmit = async (data: UserFormValues) => {
    if (user?.id) {
      await handleUpdateUser({ ...data, id: user.id });
      onClose();
    }
  };

  const defaultValues: Partial<UserFormValues> = {
    username: user?.username || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    userType: user?.userType,
    assignedOrganization: user?.assignedOrganization,
    isActive: user?.isActive ?? true,
  };

  return (
    <Modal
      title="Edit User"
      description="Update user information"
      isOpen={isOpen}
      onClose={onClose}
      className="z-[101] w-full sm:w-[80%] lg:w-[60%] h-[90%] sm:h-[550px] mt-5 overflow-y-scroll"
    >
      <UserForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={isEditUserLoading}
        onClose={onClose}
        buttonTitle="Update"
      />
    </Modal>
  );
};
