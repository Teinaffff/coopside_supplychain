import { Download, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { AddUserModal } from "../../../common/modals/AddUserModal";
import { EditUserModal } from "../../../common/modals/EditUserModal";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddUserModal } from "../../../hooks/use-add-user-modal";
import { useAppDispatch, useAppSelector } from "../../../store";
import { usersPageSelector } from "../../../store/pc/user/selectors";
import { getUsersData } from "../../../store/pc/user/user-extra";
import ExportMembersDataToExcel from "./components/ExportMembersDataToExcel";
import { columns } from "./components/columns";
import { User } from "../../../constants/interface/union/members";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(usersPageSelector);

  const { onOpen } = useAddUserModal();

  useEffect(() => {
    dispatch(getUsersData());
  }, []);

  console.log("users", users)

  const formattedUsers: User[] = users.map((item: any) => ({
    _id: item.userId,
    name: item.name,
    email: item.email,
    age: item.age,
    nationality: item.nationality,
  }));

  const deleteselectedUsers = () => {};

  return (
    <>
      <AddUserModal />
      <EditUserModal />
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
            title={`Union Members (${formattedUsers.length})`}
            description="Manage Users"
          />
          <div></div>
          <div>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportMembersDataToExcel("notfiltecyan", formattedUsers)
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
          data={formattedUsers}
          onConfirmFunction={deleteselectedUsers}
          onExport={ExportMembersDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default UsersPage;
