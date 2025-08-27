import { Modal } from "../../../../common/ui/modal";
import { ConsumerFormValues } from "../../../../schema/admin/consumer";
import { useConsumers } from "../../hooks/use-consumers";
import { useEditConsumerModal } from "../../hooks/use-edit-consumer-modal";
import ConsumerForm from "./ConsumerForm";

export const EditConsumerModal = () => {
  const { isOpen, onClose, defaultValues } = useEditConsumerModal();
  const { handleEditConsumer, isEditConsumerLoading } = useConsumers();

  const handleSubmit = (data: ConsumerFormValues) => {
    handleEditConsumer(data);
  };

  return (
    <div>
      <Modal
        title="Update Employee"
        description="Manage Employee Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[80%] h-[90%] sm:h-[750px] mt-5 overflow-y-scroll"
      >
        <ConsumerForm
          defaultValues={
            defaultValues || {
              id: 0,
              employeeId: "",
              nationalIdNumber: "",
              tin: "",
              bankAccountNumber: "",
              mobileNumber: "",
              fullLegalName: "",
              jobTitle: "",
              department: "",
              employmentType: "PERMANENT",
              employmentStartDate: "",
              employmentStatus: "ACTIVE",
              institutionId: -1,
              supervisorName: "",
              workEmail: "",
              grossSalary: 0,
              netSalary: 0,
              pensionDeduction: 0,
              incomeTaxDeduction: 0,
              otherDeductions: 0,
              salaryFrequency: "MONTHLY",
              payCycleTiming: "",
              salaryDeductionConsent: false,
              terminationRepaymentConsent: false,
              maritalStatus: "SINGLE",
              numberOfDependents: 0,
              emergencyContactName: "",
              emergencyContactRelationship: "",
              emergencyContactPhone: "",
              emergencyContactAddress: "",
              createdBy: 0,
              onboardingStatus: "PENDING",
            }
          }
          onSubmit={handleSubmit}
          loading={isEditConsumerLoading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
