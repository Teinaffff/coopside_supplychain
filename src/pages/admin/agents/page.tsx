import { Download, Plus, Trash } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddAgentModal } from "../hooks/use-add-agent-modal";
import { useAgents } from "../hooks/use-agents";
import { AddAgentModal } from "./components/AddAgentModal";
import { EditAgentModal } from "./components/EditAgentModal";
import ExportAgentsDataToExcel from "./components/ExportAgentsDataToExcel";
import { columns } from "./components/columns";

const SharesPage = () => {
  const { onOpen } = useAddAgentModal();
  const { agents, isLoading, error } = useAgents({
    isFetchAgents: true,
  });

  const deleteselectedMembers = () => {};

  return (
    <>
      <AddAgentModal />
      <EditAgentModal />
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
            title={`Agents (${agents?.length})`}
            description="Manage Agents"
          />
          <div></div>
          <div>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportAgentsDataToExcel("notfiltered", agents || [])
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
          searchPlaceholder="Search by name"
          clickable={true}
          columns={columns}
          data={agents || []}
          onConfirmFunction={deleteselectedMembers}
          onExport={ExportAgentsDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default SharesPage;
