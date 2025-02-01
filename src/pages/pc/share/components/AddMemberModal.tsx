import { useState } from "react";
import { Modal } from "../../../../common/ui/modal";
import { Share } from "../../../../constants/interface/pc/share";
import { useAddMemberModal } from "../../../../hooks/use-add-member-modal";
import { useAppDispatch } from "../../../../store";
import { createMemberData } from "../../../../store/pc/member/member-extra";
import MemberForm from "./ShareForm";

export const AddMemberModal = () => {
  const { isOpen, onClose, defaultValues } = useAddMemberModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: Share) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(createMemberData(data));
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
        title="Create Share"
        description="Manage Share Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[620px] mt-5 overflow-y-scroll"
      >
        <MemberForm
          defaultValues={
            defaultValues || {
              shareName: "",
              minShare: 1,
              pricePerShare: 0,
              shareDividend: 0,
              shareTax: 0,
              shareBackup: 0,
              status: "",
              startDate: "",
              endDate: "",
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Create"
        />
      </Modal>
    </div>
  );
};
