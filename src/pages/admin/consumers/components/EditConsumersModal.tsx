import { Modal } from "../../../../common/ui/modal";
import { Consumer } from "../../../../constants/interface/admin/consumer";
import { useEditConsumerModal } from "../../hooks/use-edit-consumer-modal";
import { useConsumers } from "../../hooks/use-consumers";
import ConsumerForm from "./ConsumerForm";

export const EditConsumerModal = () => {
  const { isOpen, onClose, defaultValues } = useEditConsumerModal();
  const { handleEditConsumer, isEditConsumerLoading } = useConsumers();


  const handleSubmit = (data: Consumer) => {
    handleEditConsumer(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Update Consumer"
        description="Manage Consumer Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <ConsumerForm
          defaultValues={
            defaultValues || {
              consumerId: -1,
              name: "",
              email: "",
              phone: "",
              age: 0,
              gender: "",
              city: "",
              subcity: "",
              woreda: "",
              registrationDate: "",
              consumerStatus: "",
              photo: undefined,
            }
          }
          onSubmit={handleSubmit}
          loading={isEditConsumerLoading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
