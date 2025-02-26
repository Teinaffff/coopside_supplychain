import { useState } from "react";
import { Modal } from "../../../../common/ui/modal";
import { Share } from "../../../../constants/interface/pc/share";
import { useEditShareModal } from "../../../../hooks/use-edit-share-modal";
import { useAppDispatch } from "../../../../store";
import MemberForm from "./ShareForm";

export const EditShareModal = () => {
  const { isOpen, onClose, defaultValues } = useEditShareModal();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSubmit = (data: Share) => {
    try {
      setLoading(true);
      console.log(data);
      // dispatch(updateMembersData(data));
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
        title="Update Share"
        description="Manage Share Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[620px] mt-5 overflow-y-scroll"
      >
        <MemberForm
          defaultValues={
            defaultValues || {
              shareId: -1,
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
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
