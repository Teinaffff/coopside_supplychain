import { Plus } from "lucide-react";
import { leaders } from "../../../common/data/data";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddLeaderModal } from "../../../hooks/use-add-leader-modal";
import { AddLeaderModal } from "./components/AddLeaderModal";
import { EditLeaderModal } from "./components/EditLeaderModal";
import ExportLeadersDataToExcel from "./components/ExportLeadersDataToExcel";
import { columns } from "./components/columns";

const LeadershipPage = () => {
  const { onOpen } = useAddLeaderModal();

  return (
    <Card className="p-5">
      <AddLeaderModal />
      <EditLeaderModal />
      <div className="flex border-b pb-2 items-center justify-between">
        <Heading
          title={`Leadership Management`}
          description="Manage PC leaders"
        />
        <div className="flex space-x-2">
          <Button
            className="bg-cyan-500 hover:bg-cyan-500"
            onClick={() => onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      <DataTable
        searchKey="name"
        clickable={true}
        columns={columns}
        data={leaders}
        onExport={ExportLeadersDataToExcel}
      />
    </Card>
  );
};

export default LeadershipPage;
