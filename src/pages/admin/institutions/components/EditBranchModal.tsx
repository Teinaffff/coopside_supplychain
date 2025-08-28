import { Modal } from "../../../../common/ui/modal";
import { BranchFormValues } from "../../../../schema/admin/institution";
import { useEditBranchModal } from "../../hooks/use-edit-branch-modal";
import { useInstitutionBranches } from "../../hooks/use-institutions";
import BranchForm from "./BranchForm";

const EditBranchModal: React.FC = () => {
  const { isOpen, onClose, defaultValues } = useEditBranchModal();
  const { handleUpdateBranch, isUpdateBranchLoading } = useInstitutionBranches(
    defaultValues?.institutionId!.toString() ?? ""
  );

  const handleSubmit = (data: BranchFormValues) => {
    handleUpdateBranch({
      branchId: defaultValues?.id?.toString() ?? "",
      data: data,
    });
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
        loading={isUpdateBranchLoading}
      />
    </Modal>
  );
};

export default EditBranchModal;
