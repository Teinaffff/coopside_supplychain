import { Modal } from "../../../../common/ui/modal";
import { useAddManufacturerModal } from "../../hooks/use-add-manufacturer-modal";
import { ManufacturerFormValues } from "../../../../schema/admin/manufacturer";
import { useManufacturers } from "../../hooks/use-manufacturers";
import ManufacturerForm from "./ManufacturerForm";

export const AddManufacturerModal = () => {
  const { isOpen, onClose, defaultValues } = useAddManufacturerModal();
  const { handleAddManufacturer, isAddManufacturerLoading } =
    useManufacturers();

  const handleSubmit = (data: ManufacturerFormValues) => {
    handleAddManufacturer(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Manufacturer"
        description="Manage Manufacturer Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <ManufacturerForm
          defaultValues={
            defaultValues || {
              name: "",
              email: "",
              phone: "",
              contactPerson: "",
              businessType: "",
              city: "",
              subcity: "",
              woreda: "",
              establishedDate: "",
              manufacturerStatus: "",
              logo: undefined,
            }
          }
          onSubmit={handleSubmit}
          loading={isAddManufacturerLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
