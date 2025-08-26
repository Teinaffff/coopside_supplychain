import { Download, Plus, Trash, Upload } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddUserModal } from "../hooks/use-add-user-modal";
import { useImportUsersModal } from "../hooks/use-import-users-modal";
import { useUsers } from "../hooks/use-users";
import { AddUserModal } from "./components/AddUserModal";
import { EditUserModal } from "./components/EditUserModal";
import ExportUsersDataToExcel from "./components/ExportUsersDataToExcel";
import { ImportUsersModal } from "./components/ImportUsersModal";
import { columns } from "./components/columns";

const UsersPage = () => {
  const { onOpen } = useAddUserModal();
  const { onOpen: onOpenImport } = useImportUsersModal();
  const { users } = useUsers({
    isFetchUsers: true,
  });

  const deleteSelectedUsers = () => {};

  return (
    <>
      <AddUserModal />
      <EditUserModal />
      <ImportUsersModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Users (${users?.length})`}
            description="Manage Admin Users"
          />
          <div></div>
          <div className="flex space-x-2">
            <Button variant={"outline"} onClick={() => onOpen()}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Button
              variant={"outline"}
              onClick={() => onOpenImport()}
              className="border-cyan-600 text-cyan-600 hover:bg-blue-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() => ExportUsersDataToExcel("notfiltered", users || [])}
              title="disabled"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="fullName"
          searchPlaceholder="Search by name"
          clickable={true}
          columns={columns}
          data={users || []}
          onConfirmFunction={deleteSelectedUsers}
          onExport={ExportUsersDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
          facetedFilters={[
            {
              columnId: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ],
            },
            {
              columnId: "userType",
              title: "Admin Type",
              options: [
                { label: "Web Admin", value: "WEB_ADMIN" },
                { label: "Agent Admin", value: "AGENT_ADMIN" },
                { label: "Seller Admin", value: "SELLER_ADMIN" },
                { label: "Institution Admin", value: "INSTITUTION_ADMIN" },
                { label: "Manufacturer Admin", value: "MANUFACTURER_ADMIN" },
                { label: "Finance Admin", value: "FINANCE_ADMIN" },
                { label: "Super Admin", value: "SUPER_ADMIN" },
              ],
            },
          ]}
        />
      </Card>
    </>
  );
};

export default UsersPage;
