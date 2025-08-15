  

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
import { Member } from "../../../../constants/interface/pc/members";
import { useEditMemberModal } from "../../../../hooks/use-edit-member-modal";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { deleteMemberData } from "../../../../store/pc/member/member-extra";
import { membersPageSelector } from "../../../../store/union/user/selectors";

export const CellAction: React.FC<{ data: Member }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [openEnable, setOpenEnable] = useState(false);

  const dispatch = useAppDispatch();
  const member = useAppSelector(membersPageSelector);
  const editMemberModal = useEditMemberModal();
  const onDelete = async () => {
    try {
      setLoading(true);
      const id = data.memberId ? data.memberId : -1;
      dispatch(deleteMemberData(id.toString()));
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };
  const onDisable = async () => {
    try {
      setLoading(true);
      // dispatch(disableAgency(data._id!.toString()) as any);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenDisable(false);
    }
  };
  const onEnable = async () => {
    try {
      setLoading(true);
      // dispatch(enableAgency(data._id!.toString()) as any);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenEnable(false);
    }
  };
  // const handleEditAgencies = (data: Agencies) => {
  //   editFlightModal.onOpen({
  //     id: data._id,
  //     agencyName: data.agencyName,
  //     agencyEmail: data.agencyEmail,
  //     agencyPhone: data.agencyPhone,
  //     agencyAddress: data.agencyAddress,
  //     totalAgents: data.totalAgents,
  //     description: data.description,
  //     agencyStatus: data.agencyStatus,
  //   });
  // };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <AlertModal
        isOpen={openDisable}
        onClose={() => setOpenDisable(false)}
        onConfirm={onDisable}
        loading={loading}
      />
      <AlertModal
        isOpen={openEnable}
        onClose={() => setOpenEnable(false)}
        onConfirm={onEnable}
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
          <DropdownMenuItem onClick={() => editMemberModal.onOpen(data)}>
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
