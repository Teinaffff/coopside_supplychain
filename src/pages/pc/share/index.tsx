import { Download, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { mockShares } from "../../../common/data/data";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Share } from "../../../constants/interface/pc/share";
import { useAddMemberModal } from "../../../hooks/use-add-member-modal";
import { useAppDispatch } from "../../../store";
import { getMembersData } from "../../../store/pc/member/member-extra";
import { AddMemberModal } from "./components/AddMemberModal";
import { EditMemberModal } from "./components/EditMemberModal";
import ExportMembersDataToExcel from "./components/ExportMembersDataToExcel";
import { columns } from "./components/columns";

const SharePage = () => {
  const dispatch = useAppDispatch();

  const { onOpen } = useAddMemberModal();

  useEffect(() => {
    dispatch(getMembersData());
  }, []);

  const formattedMembers: Share[] = mockShares.map((item: any) => ({
    ...item,
    _id: item.memberId,
  }));

  const deleteselectedMembers = () => {};

  return (
    <>
      <AddMemberModal />
      <EditMemberModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Available Shares (${formattedMembers.length})`}
            description="Manage Shares"
          />
          <div></div>
          <div className="flex space-x-2">
            <Button
              className="bg-cyan-500 hover:bg-cyan-500"
              onClick={() => onOpen()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Button
              className={`bg-cyan-500 hover:bg-cyan-500`}
              onClick={() =>
                ExportMembersDataToExcel("notfiltered", formattedMembers)
              }
              title="disabled"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="name"
          clickable={true}
          columns={columns}
          data={formattedMembers}
          onConfirmFunction={deleteselectedMembers}
          onExport={ExportMembersDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default SharePage;
