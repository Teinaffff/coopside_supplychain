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
import { useEditLeaderModal } from "../../../../hooks/use-edit-leader-modal";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { usersPageSelector } from "../../../../store/pc/user/selectors";
import { Leader } from "../../../../constants/interface/pc/leadership";

export const CellAction: React.FC<{ data: Leader }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [openEnable, setOpenEnable] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector(usersPageSelector);
  const editLeaderModal = useEditLeaderModal();
  const onDelete = async () => {
    try {
      setLoading(true);
      const id = data._id ? data._id : -1;
      // dispatch(deleteUserData(id.toString()));
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
      // dispatch(disableLeader(data._id!.toString()) as any);
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
      // dispatch(enableLeader(data._id!.toString()) as any);
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
  //     LeaderName: data.LeaderName,
  //     LeaderEmail: data.LeaderEmail,
  //     LeaderPhone: data.LeaderPhone,
  //     LeaderAddress: data.LeaderAddress,
  //     totalAgents: data.totalAgents,
  //     description: data.description,
  //     LeaderStatus: data.LeaderStatus,
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
          <DropdownMenuItem onClick={() => editLeaderModal.onOpen(data)}>
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
