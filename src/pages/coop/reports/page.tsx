import { Download, Trash } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { Report } from "../../../constants/interface/coop/report";
import { useReports } from "../hooks/use-reports";
import ExportReportsDataToExcel from "./components/ExportReportsDataToExcel";
import { columns } from "./components/columns";

const ReportsPage = () => {
  const { reports, isLoading } = useReports(true);

  const formattedReports: Report[] = reports.map((item: any) => ({
    ...item,
    _id: item.reportId,
  }));

  const deleteSelectedReports = () => {
    // Handle delete functionality
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
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Cooperative Reports (${formattedReports.length})`}
            description="Manage Cooperative Reports"
          />
          <div>
            <Button
              className="bg-cyan-600 hover:bg-cyan-600"
              onClick={() =>
                ExportReportsDataToExcel("notfiltered", formattedReports)
              }
              title="Export All Reports"
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
          data={formattedReports}
          onConfirmFunction={deleteSelectedReports}
          onExport={ExportReportsDataToExcel}
          buttonTitle="Delete Selection"
          ButtonIcon={Trash}
        />
      </Card>
    </>
  );
};

export default ReportsPage;
