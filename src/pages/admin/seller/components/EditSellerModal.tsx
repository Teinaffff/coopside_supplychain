import { Modal } from "../../../../common/ui/modal";
import { SellerFormValues } from "../../../../schema/admin/seller";
import { useEditSellerModal } from "../../hooks/use-edit-seller-modal";
import { useSellers } from "../../hooks/use-sellers";
import SellerForm from "./SellerForm";

export const EditSellerModal = () => {
  const { isOpen, onClose, defaultValues } = useEditSellerModal();
  const { handleEditSeller, isEditSellerLoading } = useSellers();

  const handleSubmit = async (data: SellerFormValues) => {
    try {
      await handleEditSeller(data);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div>
      <Modal
        title="Update Seller"
        description="Manage Seller Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <SellerForm
          defaultValues={
            defaultValues || {
              username: "",
              fullName: "",
              email: "",
              phoneNumber: "",
              agentType: "SHEMACH",
              idNumber: "",
              commissionRate: 0,
              address: {
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
              },
              isActive: true,
              bankAccountNumber: "",
              taxIdentificationNumber: "",
              profilePictureUrl: "",
              id: -1,
            }
          }
          onSubmit={handleSubmit}
          loading={isEditSellerLoading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
