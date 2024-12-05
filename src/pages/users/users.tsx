import { Download, Trash } from "lucide-react";
import React from "react";
import { Button } from "../../common/ui/button";
import { Heading } from "../../common/ui/heading";
import { columns } from "./components/columns";
import { DataTable } from "../../common/ui/data-table";
import { User, UserSliceType } from "../../constants/interface/user";
import ExportAgencyDataToExcel from "./components/ExportAgencyDataToExcel";
interface AgenciesProps {
  data: UserSliceType[];
}

const Agencies: React.FC<AgenciesProps> = ({ data }) => {
  const userAuthorities = localStorage.getItem("authorities");

  const deleteSelectedData = async (data: User[]) => {
    console.log("delete Agencies", data);
  };

  return (
    <>
      <div className="flex border-b pb-2 items-center justify-between">
        <Heading
          title={`Agencies (${data.length})`}
          description="Manage Agencies"
        />
        <div></div>
        <div
        // className={`${
        //   !userAuthorities?.includes("READ_ACCOUNT") && "cursor-not-allowed"
        // }`}
        // title={`${
        //   !userAuthorities?.includes("READ_ACCOUNT") && "Not Authorized"
        // }`}
        >
          <Button
            size="sm"
            className={`bg-red-300`}
            onClick={() => ExportAgencyDataToExcel("notfiltered", data)}
            title="disabled"
          >
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      <DataTable
        searchKey="agenciesName"
        clickable={true}
        columns={columns as any}
        data={data as any}
        onConfirmFunction={deleteSelectedData}
        onExport={ExportAgencyDataToExcel}
        buttonTitle="Delete Selection"
        ButtonIcon={Trash}
      />
    </>
  );
};

export default Agencies;
