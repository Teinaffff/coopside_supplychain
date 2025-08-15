import { Download } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useReports } from "../hooks/use-reports";
import { columns } from "./components/columns";
import ExportReportsDataToExcel from "./components/ExportReportsDataToExcel";

const ReportsPage = () => {
  const { reports } = useReports({ isFetchReports: true });

  return (
    <>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Reports (${reports?.length})`}
            description="View and manage system reports"
          />
          <div></div>
          <div>
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportReportsDataToExcel("all_reports", reports ?? [])
              }
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
          data={reports ?? []}
          onExport={ExportReportsDataToExcel}
        />
      </Card>
    </>
  );
};

export default ReportsPage;
