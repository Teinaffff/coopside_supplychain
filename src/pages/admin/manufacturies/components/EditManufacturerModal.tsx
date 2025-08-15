import { Modal } from "../../../../common/ui/modal";
import { useEditManufacturerModal } from "../../hooks/use-edit-manufacturer-modal";
import { ManufacturerFormValues } from "../../../../schema/admin/manufacturer";
import { useManufacturers } from "../../hooks/use-manufacturers";
import ManufacturerForm from "./ManufacturerForm";

export const EditManufacturerModal = () => {
  const { isOpen, onClose, defaultValues } = useEditManufacturerModal();
  const { handleEditManufacturer, isEditManufacturerLoading } =
    useManufacturers();

  const handleSubmit = (data: ManufacturerFormValues) => {
    handleEditManufacturer(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Update Manufacturer"
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
          loading={isEditManufacturerLoading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
