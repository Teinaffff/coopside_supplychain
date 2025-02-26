import { Edit } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { Separator } from "../../../../common/ui/separator";
import { useProfileChange } from "../../../../hooks/use-profile-change";
import AdminProfileForm from "./AdminProfileForm";
import PcProfileForm from "./PcProfileForm";

type HeaderSectionProps = {
  title: string;
  isEditable: boolean;
  setIsEditable: (data: boolean) => void;
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  isEditable,
  setIsEditable,
}) => (
  <div className="flex items-center justify-between mb-3">
    <span className="text-md font-bold">{title}:</span>
    {!isEditable && (
      <Button variant={"ghost"} onClick={() => setIsEditable(true)}>
        <Edit className="h-3 w-3 mr-1" />
        Edit
      </Button>
    )}
  </div>
);

const ChangeProfile = () => {
  const {
    loading,
    isEditable,
    isEditablePc,
    setIsEditable,
    setIsEditablePc,
    onSubmit,
    onSubmitPc,
  } = useProfileChange();

  return (
    <div>
      <div className="mb-3 ">
        <span className="text-xl">Profile Details</span>
      </div>
      <Separator className="my-4" />
      <div className="spaye-y-4 py-2 pb-4 w-ull">
        <HeaderSection
          isEditable={isEditablePc}
          setIsEditable={setIsEditablePc}
          title="Primary Cooperative Information:"
        />
        <PcProfileForm
          loading={loading}
          isEditablePc={isEditablePc}
          setIsEditablePc={setIsEditablePc}
          onSubmitPc={onSubmitPc}
        />
        <Separator className="my-10" />
        <HeaderSection
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          title="Admin Information:"
        />
        <AdminProfileForm
          loading={loading}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default ChangeProfile;
