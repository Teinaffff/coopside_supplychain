import { Modal } from "../../../../common/ui/modal";
import { Member } from "../../../../constants/interface/pc/members";
import { useAddMemberModal } from "../../../../hooks/use-add-member-modal";
import { usePcMembers } from "../../../pc/members/use-pc-members";
import PcForm from "./PcForm";

export const AddPcModal = () => {
  const { isOpen, onClose, defaultValues } = useAddMemberModal();
  const { handleAddMember, loading } = usePcMembers();

  const handleSubmit = (data: Member) => {
    handleAddMember(data);
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Primary Cooperative"
        description="Manage Primary Cooperative Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[700px] mt-5 overflow-y-scroll"
      >
        <PcForm
          defaultValues={
            defaultValues || {
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
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
