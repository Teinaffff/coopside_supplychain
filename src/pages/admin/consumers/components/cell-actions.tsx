  

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Button } from "../../../../common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../common/ui/dropdown-menu";
import { Consumer } from "../../../../constants/interface/admin/consumer";
import { useEditConsumerModal } from "../../hooks/use-edit-consumer-modal";

export const CellAction: React.FC<{ data: Consumer }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const editConsumerModal = useEditConsumerModal();

  const onDelete = async () => {
    try {
      setLoading(true);
      // Delete employee logic here
      console.log("Deleting employee:", data.id);
      toast.success("Employee deleted successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
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
          <DropdownMenuItem onClick={() => editConsumerModal.onOpen(data)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
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
