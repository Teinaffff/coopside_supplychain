import { Download, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Member } from "../../../constants/interface/pc/members";
import { useAddMemberModal } from "../../../hooks/use-add-member-modal";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getMembersData } from "../../../store/pc/member/member-extra";
import { membersPageSelector } from "../../../store/pc/member/selectors";
import { AddPcModal } from "./components/AddPcModal";
import { EditPcModal } from "./components/EditPctModal";
import ExportMembersDataToExcel from "./components/ExportMembersDataToExcel";
import { columns } from "./components/columns";

const SharesPage = () => {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(membersPageSelector);

  const { onOpen } = useAddMemberModal();

  useEffect(() => {
    dispatch(getMembersData());
  }, []);

  console.log("Members", members);

  const formattedMembers: Member[] = members.map((item: any) => ({
    ...item,
    _id: item.memberId,
    name: item.name,
    email: item.email,
    age: item.age,
    nationality: item.nationality,
  }));

  const deleteselectedMembers = () => {};

  return (
    <>
      <AddPcModal />
      <EditPcModal />
      <div className="flex justify-end pb-5 mx-5">
        <Button
          className="bg-cyan-600 hover:bg-cyan-600"
          onClick={() => onOpen()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Primary Cooperatives (${formattedMembers.length})`}
            description="Manage Primary Cooperatives"
          />
          <div></div>
          <div>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
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

export default SharesPage;
