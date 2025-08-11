import { Modal } from "../../../../common/ui/modal";
import { Member } from "../../../../constants/interface/pc/members";
import { useEditMemberModal } from "../../../../hooks/use-edit-member-modal";
import { usePcMembers } from "../../../pc/members/use-pc-members";
import ManufacturiesForm from "./ManufacturiesForm";

export const EditManufacturiesModal = () => {
  const { isOpen, onClose, defaultValues } = useEditMemberModal();
  const { handleEditMember, loading } = usePcMembers();

  const handleSubmit = (data: Member) => {
    handleEditMember(data);
    onClose();
  };
  return (
    <div>
      <Modal
        title="Update Manufacturies"
        description="Manage Manufacturies Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <ManufacturiesForm
          defaultValues={
            defaultValues || {
              memberId: -1,
              name: "",
              email: "",
              age: 0,
              city: "",
              subcity: "",
              woreda: "",
              startDate: "",
              photo: undefined,
              registrationFee: 0,
              collateral: "",
              inheritor: "",
              share: 0,
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
