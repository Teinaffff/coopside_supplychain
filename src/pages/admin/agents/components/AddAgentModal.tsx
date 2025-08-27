import { Modal } from "../../../../common/ui/modal";
import { AgentFormValues } from "../../../../schema/admin/agent";
import { useAgents } from "../../../admin/hooks/use-agents";
import { useAddAgentModal } from "../../hooks/use-add-agent-modal";
import AgentForm from "./AgentForm";

export const AddAgentModal = () => {
  const { isOpen, onClose } = useAddAgentModal();
  const { handleAddAgent, isAddAgentLoading } = useAgents();

  const handleSubmit = async (data: AgentFormValues) => {
    try {
      await handleAddAgent(data);
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  return (
    <div>
      <Modal
        title="Create Agent"
        description="Manage Agent Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <AgentForm
          defaultValues={{
            username: "",
            fullName: "",
            email: "",
            phoneNumber: "",
            agentType: "",
            idNumber: "",
            commissionRate: 0,
            address: {
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "Ethiopia",
            },
            isActive: true,
            bankAccountNumber: "",
            taxIdentificationNumber: "",
            profilePictureUrl: null,
          }}
          onSubmit={handleSubmit}
          loading={isAddAgentLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
