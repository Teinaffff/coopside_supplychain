import { Modal } from "../../../../common/ui/modal";
import { AgentFormValues } from "../../../../schema/admin/agent";
import { useAgents } from "../../../admin/hooks/use-agents";
import { useEditAgentModal } from "../../hooks/use-edit-agent-modal";
import AgentForm from "./AgentForm";

export const EditAgentModal = () => {
  const { isOpen, onClose, defaultValues } = useEditAgentModal();
  const { handleEditAgent, isEditAgentLoading } = useAgents();

  const handleSubmit = async (data: AgentFormValues) => {
    try {
      await handleEditAgent(data);
      onClose();
    } catch (error) {
      console.error("Error editing agent:", error);
    }
  };

  return (
    <div>
      <Modal
        title="Update Agent"
        description="Manage Agent Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <AgentForm
          defaultValues={
            defaultValues || {
              agentId: -1,
              name: "",
              phone: "",
              gender: "",
              email: "",
              age: 0,
              city: "",
              subcity: "",
              woreda: "",
              startDate: "",
              photo: undefined,
            }
          }
          onSubmit={handleSubmit}
          loading={isEditAgentLoading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
