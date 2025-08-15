import { Modal } from "../../../../common/ui/modal";
import { AgentFormValues } from "../../../../schema/admin/agent";
import { useAgents } from "../../../admin/hooks/use-agents";
import { useAddAgentModal } from "../../hooks/use-add-agent-modal";
import AgentForm from "./AgentForm";

export const AddAgentModal = () => {
  const { isOpen, onClose, defaultValues } = useAddAgentModal();
  const { handleAddAgent, isAddAgentLoading } = useAgents();

  const handleSubmit = async (data: AgentFormValues) => {
    try {
      await handleAddAgent(data);
      onClose();
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
          defaultValues={
            defaultValues || {
              name: "",
              email: "",
              phone: "",
              age: 0,
              city: "",
              subcity: "",
              woreda: "",
              gender: "",
              startDate: "",
              photo: undefined,
            }
          }
          onSubmit={handleSubmit}
          loading={isAddAgentLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
