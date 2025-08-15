import { Modal } from "../../../../common/ui/modal";
import { Institution } from "../../../../constants/interface/admin/institution";
import { useEditInstitutionModal } from "../../hooks/use-edit-institution-modal";
import { useInstitutions } from "../../hooks/use-institutions";
import InstitutionForm from "./InstitutionForm";

export const EditInstitutionsModal = () => {
  const { isOpen, onClose, defaultValues } = useEditInstitutionModal();
  const { handleEditInstitution, isEditInstitutionLoading } = useInstitutions();

  const handleSubmit = (data: Institution) => {
    handleEditInstitution(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Update Institution"
        description="Manage Institution Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <InstitutionForm
          defaultValues={
            defaultValues || {
              institutionId: -1,
              name: "",
              email: "",
              phone: "",
              institutionType: "",
              contactPerson: "",
              city: "",
              subcity: "",
              woreda: "",
              establishedDate: "",
              institutionStatus: "",
              logo: undefined,
            }
          }
          onSubmit={handleSubmit}
          loading={isEditInstitutionLoading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
