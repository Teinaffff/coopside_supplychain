import { Modal } from "../../../../common/ui/modal";
import { Share } from "../../../../constants/interface/pc/share";
import { useAddShareModal } from "../../../../hooks/use-add-share-modal";
import ShareForm from "./ShareForm";
import { usePcShare } from "./use-pc-share";

export const AddShareModal = () => {
  const { isOpen, onClose, defaultValues } = useAddShareModal();
  const { loading, handleAddPcShare } = usePcShare();

  const handleSubmit = (data: Share) => {
    handleAddPcShare(data);
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
        <ShareForm
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
