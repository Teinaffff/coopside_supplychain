import { useState } from "react";
import { Modal } from "../../../../common/ui/modal";
import { Member } from "../../../../constants/interface/pc/members";
import { useEditMemberModal } from "../../../../hooks/use-edit-member-modal";
import { useAppDispatch } from "../../../../store";
import { updateMembersData } from "../../../../store/pc/member/member-extra";
import MemberForm from "./MemberForm";

export const EditMemberModal = () => {
  const { isOpen, onClose, defaultValues } = useEditMemberModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: Member) => {
    try {
      setLoading(true);
      console.log("object: ", data);
      dispatch(updateMembersData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    onClose();
  };
  console.log("default: ", defaultValues);

  return (
    <div>
      <Modal
        title="Update Member"
        description="Manage Member Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[70%] lg:w-[40%] h-[50%] sm:h-[600px] mt-5 overflow-y-scroll"
      >
        <MemberForm
          defaultValues={
            defaultValues || {
              _id: -1,
              name: "",
              email: "",
              age: 0,
              nationality: "",
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
