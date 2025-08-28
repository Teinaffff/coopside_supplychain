import { Modal } from "../../../../common/ui/modal";
import { BranchFormValues } from "../../../../schema/admin/institution";
import { useAddBranchModal } from "../../hooks/use-add-branch-modal";
import { useInstitutionBranches } from "../../hooks/use-institutions";
import BranchForm from "./BranchForm";

const AddBranchModal: React.FC = () => {
  const { isOpen, onClose, institutionId } = useAddBranchModal();
  const { handleAddBranch, isAddBranchLoading } = useInstitutionBranches(
    institutionId ?? ""
  );

  const handleSubmit = (data: BranchFormValues) => {
    handleAddBranch(data);
  };

  if (!institutionId) return null;

  return (
    <Modal
      title="Add New Branch"
      description={`Create a new branch institution`}
      isOpen={isOpen}
      onClose={onClose}
      className="z-[102] w-full sm:w-[90%] lg:w-[600px] max-h-[90vh] overflow-y-auto"
    >
      <BranchForm
        onSubmit={handleSubmit}
        onClose={onClose}
        buttonTitle="Add Branch"
        institutionId={institutionId}
        loading={isAddBranchLoading}
      />
    </Modal>
  );
};

export default AddBranchModal;
