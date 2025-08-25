import { Download, Plus, Trash, Upload } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddManufacturerModal } from "../hooks/use-add-manufacturer-modal";
import { useImportManufacturersModal } from "../hooks/use-import-manufacturers-modal";
import { useManufacturers } from "../hooks/use-manufacturers";
import { AddManufacturerModal } from "./components/AddManufacturerModal";
import { EditManufacturerModal } from "./components/EditManufacturerModal";
import { ImportManufacturersModal } from "./components/ImportManufacturersModal";
import ExportManufacturiesDataToExcel from "./components/ExportManufacturiesDataToExcel";
import { columns } from "./components/columns";

const ManufacturersPage = () => {
  const { onOpen } = useAddManufacturerModal();
  const { onOpen: onOpenImport } = useImportManufacturersModal();
  const { manufacturers } = useManufacturers();

  const deleteSelectedManufacturers = () => {
    // Implementation for bulk delete
  };

  return (
    <>
      <AddManufacturerModal />
      <EditManufacturerModal />
      <ImportManufacturersModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Factories (${manufacturers.length})`}
            description="Manage Factories"
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
                ExportManufacturiesDataToExcel("notfiltered", manufacturers)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="factoryName"
          clickable={true}
          columns={columns}
          data={manufacturers}
          onConfirmFunction={deleteSelectedManufacturers}
          onExport={ExportManufacturiesDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default ManufacturersPage;
