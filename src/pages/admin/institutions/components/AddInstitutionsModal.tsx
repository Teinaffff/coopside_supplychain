import { Modal } from "../../../../common/ui/modal";
import { Institution } from "../../../../constants/interface/admin/institution";
import { useAddInstitutionModal } from "../../hooks/use-add-institution-modal";
import { useInstitutions } from "../../hooks/use-institutions";
import InstitutionForm from "./InstitutionForm";

export const AddInstitutionsModal = () => {
  const { isOpen, onClose } = useAddInstitutionModal();
  const { handleAddInstitution, isAddInstitutionLoading } = useInstitutions();

  const handleSubmit = (data: Institution) => {
    handleAddInstitution(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Institution"
        description="Manage Institution Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <InstitutionForm
          defaultValues={{
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
          loading={isAddInstitutionLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
