import { Edit } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { Separator } from "../../../../common/ui/separator";
import { useProfileChange } from "../../../../hooks/use-profile-change";
import AdminProfileForm from "./AdminProfileForm";
import PcProfileForm from "./PcProfileForm";

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
        <div className="flex items-center justify-between mb-3">
          <span className="text-md font-bold">
            Primary Cooperative Information:
          </span>
          {!isEditablePc && (
            <Button variant={"ghost"} onClick={() => setIsEditablePc(true)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        <PcProfileForm
          loading={loading}
          isEditablePc={isEditablePc}
          setIsEditablePc={setIsEditablePc}
          onSubmitPc={onSubmitPc}
        />
        <Separator className="my-10" />
        <div className="flex items-center justify-between mb-3 mt-5">
          <span className="text-md font-bold">Admin Information:</span>
          {!isEditable && (
            <Button variant={"ghost"} onClick={() => setIsEditable(true)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
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
