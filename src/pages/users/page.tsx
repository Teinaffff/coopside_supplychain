import { Download, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { AddUserModal } from "../../common/modals/AddUserModal";
import {
  EditUserModal
} from "../../common/modals/EditUserModal";
import { Button } from "../../common/ui/button";
import { Card } from "../../common/ui/card";
import { DataTable } from "../../common/ui/data-table";
import { Heading } from "../../common/ui/heading";
import { User } from "../../constants/interface/user";
import { useAddUserModal } from "../../hooks/use-add-user-modal";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAppDispatch, useAppSelector } from "../../store";
import { usersPageSelector } from "../../store/user/selectors";
import { getUsersData } from "../../store/user/user-extra";
import ExportAgencyDataToExcel from "./components/ExportAgencyDataToExcel";
import { columns } from "./components/columns";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(usersPageSelector);

  const { onOpen } = useAddUserModal();

  useEffect(() => {
    dispatch(getUsersData());
  }, []);

  const formattedUsers: User[] = users.map((item: any) => ({
    _id: item.userId,
    name: item.name,
    email: item.email,
    age: item.age,
    nationality: item.nationality,
  }));

  const deleteselectedUsers = () => {};

  return (
    <DefaultLayout>
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
            title={`Users (${formattedUsers.length})`}
            description="Manage Users"
          />
          <div></div>
          <div>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportAgencyDataToExcel("notfiltecyan", formattedUsers)
              }
              title="disabled"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="agencyName"
          clickable={true}
          columns={columns}
          data={formattedUsers}
          onConfirmFunction={deleteselectedUsers}
          onExport={ExportAgencyDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </DefaultLayout>
  );
};

export default UsersPage;
