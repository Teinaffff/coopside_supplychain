import { Download, Plus, Trash, Upload } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddInstitutionModal } from "../hooks/use-add-institution-modal";
import { useImportInstitutionsModal } from "../hooks/use-import-institutions-modal";
import { useInstitutions } from "../hooks/use-institutions";
import { AddInstitutionsModal } from "./components/AddInstitutionsModal";
import { EditInstitutionsModal } from "./components/EditInstitutionsModal";
import { ImportInstitutionsModal } from "./components/ImportInstitutionsModal";
import ExportInstitutionsDataToExcel from "./components/ExportInstitutionsDataToExcel";
import { columns } from "./components/columns";

const InstitutionsPage = () => {
  const { institutions } = useInstitutions();
  const { onOpen } = useAddInstitutionModal();
  const { onOpen: onOpenImport } = useImportInstitutionsModal();

  const deleteSelectedInstitutions = () => {
    // Delete selected institutions logic
  };

  return (
    <>
      <AddInstitutionsModal />
      <EditInstitutionsModal />
      <ImportInstitutionsModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Institutions (${institutions?.length})`}
            description="Manage Institutions"
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
                ExportInstitutionsDataToExcel("notfiltered", institutions ?? [])
              }
              title="Export All"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="fullLegalName"
          searchPlaceholder="Search by institution name"
          clickable={true}
          columns={columns}
          data={institutions || []}
          onConfirmFunction={deleteSelectedInstitutions}
          onExport={ExportInstitutionsDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default InstitutionsPage;
