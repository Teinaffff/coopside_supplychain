import { Download, Plus, Trash } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Consumer } from "../../../constants/interface/admin/consumer";
import { useAddConsumerModal } from "../hooks/use-add-consumer-modal";
import { useConsumers } from "../hooks/use-consumers";
import { AddConsumerModal } from "./components/AddConsumersModal";
import { EditConsumerModal } from "./components/EditConsumersModal";
import ExportConsumerDataToExcel from "./components/ExportConsumerDataToExcel";
import { columns } from "./components/columns";

const ConsumersPage = () => {
  const { consumers } = useConsumers();
  const { onOpen } = useAddConsumerModal();

  const deleteSelectedConsumers = () => {
    // Delete selected consumers logic
  };

  return (
    <>
      <AddConsumerModal />
      <EditConsumerModal />
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
            title={`Consumers (${consumers?.length})`}
            description="Manage Consumers"
          />
          <div></div>
          <div>
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
