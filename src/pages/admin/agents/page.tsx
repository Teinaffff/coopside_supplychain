import { Download, Plus, Trash, Upload } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Agent } from "../../../constants/interface/admin/agent";
import { useAddAgentModal } from "../hooks/use-add-agent-modal";
import { useAgents } from "../hooks/use-agents";
import { useImportAgentsModal } from "../hooks/use-import-agents-modal";
import { AddAgentModal } from "./components/AddAgentModal";
import { EditAgentModal } from "./components/EditAgentModal";
import ExportAgentsDataToExcel from "./components/ExportAgentsDataToExcel";
import { ImportAgentsModal } from "./components/ImportAgentsModal";
import { columns } from "./components/columns";

const AgentPage = () => {
  const { onOpen } = useAddAgentModal();
  const { onOpen: onOpenImport } = useImportAgentsModal();
  const { agents } = useAgents({
    isFetchAgents: true,
  });


  const formattedAgents = useMemo(() => {
    return agents?.map((agent: Agent) => ({
      ...agent,
      isActive: agent.isActive.toString(),
    }));
  }, [agents]);

  const deleteselectedMembers = () => {};
  
  return (
    <>
      <AddAgentModal />
      <EditAgentModal />
      <ImportAgentsModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Agents (${agents?.length ?? 0})`}
            description="Manage Agents"
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
              onClick={() =>
                ExportAgentsDataToExcel("notfiltered", agents ?? [])
              }
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
          data={formattedAgents ?? []}
          onConfirmFunction={deleteselectedMembers}
          onExport={ExportAgentsDataToExcel}
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
          ]}
        />
      </Card>
    </>
  );
};

export default AgentPage;
