import { Modal } from "../../../../common/ui/modal";
import { ConsumerFormValues } from "../../../../schema/admin/consumer";
import { useAddConsumerModal } from "../../hooks/use-add-consumer-modal";
import { useConsumers } from "../../hooks/use-consumers";
import ConsumerForm from "./ConsumerForm";

export const AddConsumerModal = () => {
  const { isOpen, onClose } = useAddConsumerModal();
  const { handleAddConsumer, isAddConsumerLoading } = useConsumers();

  const handleSubmit = (data: ConsumerFormValues) => {
    handleAddConsumer(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Employee"
        description="Manage Employee Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[80%] h-[90%] sm:h-[750px] mt-5 overflow-y-scroll"
      >
        <ConsumerForm
          defaultValues={{
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
          }}
          onSubmit={handleSubmit}
          loading={isAddConsumerLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
