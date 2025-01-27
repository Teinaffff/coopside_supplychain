import { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "../../../../common/ui/modal";
import { Member } from "../../../../constants/interface/pc/members";
import { useAddMemberModal } from "../../../../hooks/use-add-member-modal";
import { createMemberData } from "../../../../store/pc/member/member-extra";
import MemberForm from "./MemberForm";
import { useAppDispatch } from "../../../../store";

export const AddMemberModal = () => {
  const { isOpen, onClose, defaultValues } = useAddMemberModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: Member) => {
    try {
      setLoading(true);
      console.log(data);
      dispatch(createMemberData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Members"
        description="Manage Members Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[70%] lg:w-[40%] h-[90%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <MemberForm
          defaultValues={
            defaultValues || {
              name: "",
              email: "",
              nationality: "",
              age: 0,
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
