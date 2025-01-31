import { CheckCheck, Edit, Eye, MoreHorizontal, Trash, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Button } from "../../../../common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../common/ui/dropdown-menu";
import { Share } from "../../../../constants/interface/pc/share";
import { useEditMemberModal } from "../../../../hooks/use-edit-member-modal";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { deleteMemberData } from "../../../../store/pc/member/member-extra";
import { membersPageSelector } from "../../../../store/pc/member/selectors";

export const CellAction: React.FC<{ data: Share }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [openEnable, setOpenEnable] = useState(false);

  const dispatch = useAppDispatch();
  const Member = useAppSelector(membersPageSelector);
  const editMemberModal = useEditMemberModal();

  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      setLoading(true);
      const id = data.shareId ? data.shareId : -1;
      // dispatch(deleteMemberData(id.toString()));
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
          <DropdownMenuItem
            onClick={() => navigate(`/pc/members/${data.shareId}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenDisable(true)}>
            <X className="mr-2 h-4 w-4" />
            Block
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEnable(true)}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Activate
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
