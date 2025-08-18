import { Download, Plus, Trash } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddSellerModal } from "../hooks/use-add-seller-modal";
import { useSellers } from "../hooks/use-sellers";
import { AddSellerModal } from "./components/AddSellerModal";
import { EditSellerModal } from "./components/EditSellerModal";
import ExportSellerDataToExcel from "./components/ExportSellerDataToExcel";
import { columns } from "./components/columns";

const SellersPage = () => {
  const { onOpen } = useAddSellerModal();
  const { sellers, isLoading } = useSellers({
    isFetchSellers: true,
  });

  const deleteSelectedSellers = () => {};

  return (
    <>
      <AddSellerModal />
      <EditSellerModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Primary Cooperatives (${sellers?.length || 0})`}
            description="Manage Primary Cooperatives"
          />
          <div></div>
           <div className="flex space-x-2">
            <Button
              variant={"outline"}
              onClick={() => onOpen()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportSellerDataToExcel("notfiltered", sellers || [])
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
          data={sellers || []}
          onConfirmFunction={deleteSelectedSellers}
          onExport={ExportSellerDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default SellersPage;
