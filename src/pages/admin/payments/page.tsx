import { Download } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { usePayments } from "../hooks/use-payments";
import { columns } from "./components/columns";
import ExportPaymentsDataToExcel from "./components/ExportpaymentsDataToExcel";

const PaymentsPage = () => {
  const { payments } = usePayments({
    isFetchPayments: true,
  });

  const formattedPayments = useMemo(() => payments || [], [payments]);

  return (
    <>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Payments (${formattedPayments?.length ?? 0})`}
            description="Monitor Payment History"
          />
          <div></div>
          <div className="flex space-x-2">
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportPaymentsDataToExcel("notfiltered", formattedPayments)
              }
              title="Export payments"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="paymentId"
          searchPlaceholder="Search by payment ID"
          clickable={true}
          columns={columns}
          data={formattedPayments ?? []}
          onExport={ExportPaymentsDataToExcel}
          facetedFilters={[
            {
              columnId: "status",
              title: "Status",
              options: [
                { label: "Pending", value: "PENDING" },
                { label: "Processing", value: "PROCESSING" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Failed", value: "FAILED" },
                { label: "Cancelled", value: "CANCELLED" },
                { label: "Refunded", value: "REFUNDED" },
              ],
            },
            {
              columnId: "paymentType",
              title: "Payment Type",
              options: [
                { label: "Salary Payment", value: "SALARY_PAYMENT" },
                { label: "Loan Repayment", value: "LOAN_REPAYMENT" },
                { label: "Purchase Payment", value: "PURCHASE_PAYMENT" },
                { label: "Commission Payment", value: "COMMISSION_PAYMENT" },
                { label: "Refund", value: "REFUND" },
              ],
            },
            {
              columnId: "priority",
              title: "Priority",
              options: [
                { label: "Low", value: "LOW" },
                { label: "Medium", value: "MEDIUM" },
                { label: "High", value: "HIGH" },
                { label: "Urgent", value: "URGENT" },
              ],
            },
            {
              columnId: "approvalStatus",
              title: "Approval Status",
              options: [
                { label: "Pending Approval", value: "PENDING" },
                { label: "Approved", value: "APPROVED" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Auto Approved", value: "AUTO_APPROVED" },
              ],
            },
          ]}
        />
      </Card>
    </>
  );
};

export default PaymentsPage;
