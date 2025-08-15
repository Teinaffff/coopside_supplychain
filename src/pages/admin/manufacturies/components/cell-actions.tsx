

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
import { Manufacturer } from "../../../../constants/interface/admin/manufacturer";
import { useEditManufacturerModal } from "../../hooks/use-edit-manufacturer-modal";
import { useManufacturers } from "../../hooks/use-manufacturers";

export const CellAction: React.FC<{ data: Manufacturer }> = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const editManufacturerModal = useEditManufacturerModal();
  const { deleteManufacturer } = useManufacturers();

  const onDelete = async () => {
    try {
      await deleteManufacturer.mutateAsync(data.manufacturerId!);
      setOpenDelete(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEdit = () => {
    editManufacturerModal.onOpen(data);
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={deleteManufacturer.isPending}
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
