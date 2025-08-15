  

import { Edit, MoreHorizontal, Trash } from "lucide-react";
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
import { Institution } from "../../../../constants/interface/admin/institution";
import { useEditInstitutionModal } from "../../hooks/use-edit-institution-modal";
import { useInstitutions } from "../../hooks/use-institutions";

export const CellAction: React.FC<{ data: Institution }> = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const editInstitutionModal = useEditInstitutionModal();
  const { handleDeleteInstitution, isDeleteInstitutionLoading } = useInstitutions();

  const onDelete = async () => {
    try {
      await handleDeleteInstitution(data.institutionId ?? "");
      setOpenDelete(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEdit = () => {
    editInstitutionModal.onOpen(data);
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeleteInstitutionLoading}
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
          <DropdownMenuItem onClick={handleEdit}>
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
