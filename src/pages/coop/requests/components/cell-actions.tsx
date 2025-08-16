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
import { Request } from "../../../../constants/interface/coop/request";

export const CellAction: React.FC<{ data: Request }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual delete functionality
      toast.success(`Request ${data.requestId} deleted successfully!`);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  const onEdit = () => {
    // TODO: Implement edit functionality
    toast.success(`Edit request ${data.requestId}`);
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
          <DropdownMenuItem onClick={onEdit}>
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
