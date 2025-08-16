import { Download, Plus, Trash } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Request } from "../../../constants/interface/coop/request";
import { useRequests } from "../hooks/use-requests";
import ExportRequestsDataToExcel from "./components/ExportRequestsDataToExcel";
import { columns } from "./components/columns";

const RequestsPage = () => {
  const { requests, isLoading } = useRequests(true);

  const formattedRequests: Request[] = requests.map((item: any) => ({
    ...item,
    _id: item.requestId,
  }));

  const deleteSelectedRequests = () => {
    // Handle delete functionality
  };

  const handleAddRequest = () => {
    // Handle add request functionality
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end pb-5 mx-5">
        <Button
          className="bg-cyan-600 hover:bg-cyan-600"
          onClick={handleAddRequest}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Request
        </Button>
      </div>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Cooperative Requests (${formattedRequests.length})`}
            description="Manage Cooperative Requests"
          />
          <div>
            <Button
              className="bg-cyan-600 hover:bg-cyan-600"
              onClick={() =>
                ExportRequestsDataToExcel("notfiltered", formattedRequests)
              }
              title="Export All Requests"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="title"
          clickable={true}
          columns={columns}
          data={formattedRequests}
          onConfirmFunction={deleteSelectedRequests}
          onExport={ExportRequestsDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default RequestsPage;
