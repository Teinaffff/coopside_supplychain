import { Modal } from "../../../../common/ui/modal";
import { InstitutionFormValues } from "../../../../schema/admin/institution";
import { useEditInstitutionModal } from "../../hooks/use-edit-institution-modal";
import { useInstitutions } from "../../hooks/use-institutions";
import InstitutionForm from "./InstitutionForm";

export const EditInstitutionsModal = () => {
  const { isOpen, onClose, defaultValues } = useEditInstitutionModal();
  const { handleEditInstitution, isEditInstitutionLoading } = useInstitutions();

  const handleSubmit = (data: InstitutionFormValues) => {
    handleEditInstitution(data);
  };

  return (
    <div>
      <Modal
        title="Update Institution"
        description="Manage Institution Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[80%] h-[90%] sm:h-[750px] mt-5 overflow-y-scroll"
      >
        <InstitutionForm
          defaultValues={
            defaultValues || {
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
              institutionType: "GOVERNMENT",
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
