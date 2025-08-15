import { Modal } from "../../../../common/ui/modal";
import { Consumer } from "../../../../constants/interface/admin/consumer";
import { useAddConsumerModal } from "../../hooks/use-add-consumer-modal";
import { useConsumers } from "../../hooks/use-consumers";
import ConsumerForm from "./ConsumerForm";

export const AddConsumerModal = () => {
  const { isOpen, onClose, defaultValues } = useAddConsumerModal();
  const { handleAddConsumer, isAddConsumerLoading } = useConsumers();

  const handleSubmit = (data: Consumer) => {
    handleAddConsumer(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Consumer"
        description="Manage Consumer Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <ConsumerForm
          defaultValues={
            defaultValues || {
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
          loading={isAddConsumerLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
