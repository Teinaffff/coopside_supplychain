import { Modal } from "../../../../common/ui/modal";
import { useAddSellerModal } from "../../hooks/use-add-seller-modal";
import { useSellers } from "../../hooks/use-sellers";
import { SellerFormValues } from "../../../../schema/admin/seller";
import SellerForm from "./SellerForm";

export const AddSellerModal = () => {
  const { isOpen, onClose, defaultValues } = useAddSellerModal();
  const { handleAddSeller, isAddSellerLoading } = useSellers();

  const handleSubmit = async (data: SellerFormValues) => {
    try {
      await handleAddSeller(data as any);
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div>
      <Modal
        title="Create Seller"
        description="Manage Seller Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <SellerForm
          defaultValues={
            defaultValues || {
              name: "",
              email: "",
              phone: "",
              chairperson: "",
              memberCount: 0,
              city: "",
              subcity: "",
              woreda: "",
              establishedDate: "",
              sellerStatus: "",
              logoUrl: "",
            }
          }
          onSubmit={handleSubmit}
          loading={isAddSellerLoading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};