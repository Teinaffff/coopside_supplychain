import { Download, Plus, Trash, Upload } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Seller } from "../../../constants/interface/admin/seller";
import { useAddSellerModal } from "../hooks/use-add-seller-modal";
import { useImportSellersModal } from "../hooks/use-import-sellers-modal";
import { useSellers } from "../hooks/use-sellers";
import { AddSellerModal } from "./components/AddSellerModal";
import { EditSellerModal } from "./components/EditSellerModal";
import ExportSellerDataToExcel from "./components/ExportSellerDataToExcel";
import { ImportSellersModal } from "./components/ImportSellersModal";
import { columns } from "./components/columns";

const SellersPage = () => {
  const { onOpen } = useAddSellerModal();
  const { onOpen: onOpenImport } = useImportSellersModal();
  const { sellers } = useSellers({
    isFetchSellers: true,
  });

  const formattedSellers = useMemo(
    () => sellers?.filter((seller: Seller) => seller.agentType === "SHEMACH") || [],
    [sellers]
  );

  const deleteSelectedSellers = () => {};

  return (
    <>
      <AddSellerModal />
      <EditSellerModal />
      <ImportSellersModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Sellers (${formattedSellers?.length || 0})`}
            description="Manage Sellers"
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
                ExportSellerDataToExcel("notfiltered", formattedSellers || [])
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
          data={formattedSellers || []}
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
