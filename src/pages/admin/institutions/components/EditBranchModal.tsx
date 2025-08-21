import { Modal } from "../../../../common/ui/modal";
import { BranchFormValues } from "../../../../schema/admin/institution";
import { useEditBranchModal } from "../../hooks/use-edit-branch-modal";
import BranchForm from "./BranchForm";

const EditBranchModal: React.FC = () => {
  const { isOpen, onClose, defaultValues } = useEditBranchModal();

  const handleSubmit = (data: BranchFormValues) => {
    // TODO: Implement API call to update branch
    console.log("Updating branch:", data);
    onClose();
  };

  if (!defaultValues) return null;

  return (
    <Modal
      title="Edit Branch"
      description={`Update branch institution information`}
      isOpen={isOpen}
      onClose={onClose}
      className="z-[102] w-full sm:w-[90%] lg:w-[600px] max-h-[90vh] overflow-y-auto"
    >
      <BranchForm
        defaultValues={{
          id: defaultValues.id,
          institutionId: defaultValues.institutionId!,
          branchName: defaultValues.branchName || "",
          address: defaultValues.address || "",
          phoneNumber: defaultValues.phoneNumber || "",
          email: defaultValues.email || "",
          branchManager: defaultValues.branchManager || "",
          isActive: defaultValues.isActive ?? true,
        }}
        onSubmit={handleSubmit}
        onClose={onClose}
        buttonTitle="Update Branch"
        institutionId={defaultValues.institutionId!.toString()}
        loading={false}
      />
    </Modal>
  );
};

export default EditBranchModal;
