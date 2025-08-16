import { Edit, MoreHorizontal, Trash, X } from "lucide-react";
import { useState } from "react";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Button } from "../../../../common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../common/ui/dropdown-menu";
import { Agent } from "../../../../constants/interface/admin/agent";
import { useAgents } from "../../../admin/hooks/use-agents";
import { useEditAgentModal } from "../../hooks/use-edit-agent-modal";

interface CellActionsProps {
  data: Agent;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const editAgentModal = useEditAgentModal();
  const { handleDeleteAgent, isDeleteAgentLoading } = useAgents();

  const onDelete = async () => {
    try {
      await handleDeleteAgent(data.agentId?.toString() || "");
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeleteAgentLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => editAgentModal.onOpen(data)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <X className="mr-2 h-4 w-4" />
            Block
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
