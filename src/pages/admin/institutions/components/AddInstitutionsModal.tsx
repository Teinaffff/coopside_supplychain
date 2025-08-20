import { Modal } from "../../../../common/ui/modal";
import { InstitutionFormValues } from "../../../../schema/admin/institution";
import { useAddInstitutionModal } from "../../hooks/use-add-institution-modal";
import { useInstitutions } from "../../hooks/use-institutions";
import InstitutionForm from "./InstitutionForm";

export const AddInstitutionsModal = () => {
  const { isOpen, onClose } = useAddInstitutionModal();
  const { handleAddInstitution, isAddInstitutionLoading } = useInstitutions();

  const handleSubmit = (data: InstitutionFormValues) => {
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
        className="z-[101] w-full sm:w-[80%] lg:w-[90%] h-[90%] sm:h-[750px] mt-5 overflow-y-scroll"
      >
        <InstitutionForm
          defaultValues={{
            fullLegalName: "",
            yearOfEstablishment: new Date().getFullYear(),
            businessSector: "",
            tin: "",
            vatRegistrationCertificate: "",
            currentCapital: 0,
            permanentEmployees: 0,
            contractualEmployees: 0,
            totalBranches: 1,
            totalAssetValuation: 0,
            organizationalStructure: "",
            contactEmail: "",
            contactPhone: "",
            mainOfficeAddress: "",
            institutionType: "",
            businessLicenseNumber: "",
            establishmentProclamation: "",
            employeeConsentProvided: false,
            monthlyPayrollCommitment: false,
            employeeTerminationNotificationAgreement: false,
            outstandingReceivablesPriorityAgreement: false,
            loanRepaymentDeductionAgreement: false,
            digitalChannelUsageAgreement: false,
            onboardingStatus: "pending",
            logo: undefined,
          }}
          onSubmit={handleSubmit}
          loading={isAddInstitutionLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
