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
import { AdminUser } from "../../../../constants/interface/admin/user";
import { useUsers } from "../../hooks/use-users";
import { useEditUserModal } from "../../hooks/use-edit-user-modal";

interface CellActionsProps {
  data: AdminUser;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const editUserModal = useEditUserModal();
  const { handleDeleteUser, isDeleteUserLoading } = useUsers();

  const onDelete = async () => {
    try {
      await handleDeleteUser(data.id || 0);
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeleteUserLoading}
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
          <DropdownMenuItem onClick={() => editUserModal.onOpen(data)}>
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