import { Download } from "lucide-react";
import { loanStatuses, loanTypes } from "../../../common/data/data";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import ExportLoansDataToExcel from "./components/ExportLoansDataToExcel";
import { columns } from "./components/columns";
import { useLoans } from "./hooks/use-loans";

const LoansPage = () => {
  const { loans } = useLoans({
    isFetchLoans: true,
  });

  return (
    <>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Loans (${loans?.length ?? 0})`}
            description="Review and manage loan applications"
          />
          <div className="flex space-x-2">
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() => ExportLoansDataToExcel("notfiltered", loans ?? [])}
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="loanId"
          searchPlaceholder="Search by loan ID"
          clickable={true}
          columns={columns}
          data={loans ?? []}
          onExport={ExportLoansDataToExcel}
          facetedFilters={[
            {
              columnId: "status",
              title: "Status",
              options: loanStatuses,
            },
            {
              columnId: "loanType",
              title: "Loan Type",
              options: loanTypes,
            },
          ]}
        />
      </Card>
    </>
  );
};

export default LoansPage;
