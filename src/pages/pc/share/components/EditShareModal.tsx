import { Modal } from "../../../../common/ui/modal";
import { Share } from "../../../../constants/interface/pc/share";
import { useEditShareModal } from "../../../../hooks/use-edit-share-modal";
import MemberForm from "./ShareForm";
import { usePcShare } from "./use-pc-share";

export const EditShareModal = () => {
  const { isOpen, onClose, defaultValues } = useEditShareModal();
  const { loading, handleEditPcShare } = usePcShare();

  const handleSubmit = (data: Share) => {
    handleEditPcShare(data);
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
