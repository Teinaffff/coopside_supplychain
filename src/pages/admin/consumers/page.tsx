import { Download, Plus, Trash, Upload } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddConsumerModal } from "../hooks/use-add-consumer-modal";
import { useImportConsumersModal } from "../hooks/use-import-consumers-modal";
import { useConsumers } from "../hooks/use-consumers";
import { AddConsumerModal } from "./components/AddConsumersModal";
import { EditConsumerModal } from "./components/EditConsumersModal";
import { ImportConsumersModal } from "./components/ImportConsumersModal";
import ExportConsumerDataToExcel from "./components/ExportConsumerDataToExcel";
import { columns } from "./components/columns";

const ConsumersPage = () => {
  const { consumers } = useConsumers();
  const { onOpen } = useAddConsumerModal();
  const { onOpen: onOpenImport } = useImportConsumersModal();

  const deleteSelectedConsumers = () => {
    // Delete selected consumers logic
  };

  return (
    <>
      <AddConsumerModal />
      <EditConsumerModal />
      <ImportConsumersModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Consumers (${consumers?.length})`}
            description="Manage Consumers"
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
                ExportConsumerDataToExcel("notfiltered", consumers ?? [])
              }
              title="Export All"
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
          data={consumers || []}
          onConfirmFunction={deleteSelectedConsumers}
          onExport={ExportConsumerDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default ConsumersPage;
