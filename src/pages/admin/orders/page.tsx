import { Download } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useOrders } from "../hooks/use-orders";
import { columns } from "./components/columns";
import ExportOrdersDataToExcel from "./components/ExportOrdersDataToExcel";

const OrdersPage = () => {
  const { orders } = useOrders({
    isFetchOrders: true,
  });

  const formattedOrders = useMemo(() => orders || [], [orders]);

  return (
    <>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Orders (${formattedOrders?.length ?? 0})`}
            description="Manage Orders"
          />
          <div></div>
          <div className="flex space-x-2">
            <Button
              className={`bg-cyan-600 hover:bg-cyan-600`}
              onClick={() =>
                ExportOrdersDataToExcel("notfiltered", formattedOrders)
              }
              title="Export orders"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="orderNumber"
          searchPlaceholder="Search by order number"
          clickable={true}
          columns={columns}
          data={formattedOrders ?? []}
          onExport={ExportOrdersDataToExcel}
          facetedFilters={[
            {
              columnId: "status",
              title: "Status",
              options: [
                { label: "Pending", value: "PENDING" },
                { label: "Confirmed", value: "CONFIRMED" },
                { label: "Processing", value: "PROCESSING" },
                { label: "Shipped", value: "SHIPPED" },
                { label: "Delivered", value: "DELIVERED" },
                { label: "Cancelled", value: "CANCELLED" },
              ],
            },
            {
              columnId: "orderType",
              title: "Order Type",
              options: [
                { label: "Agent to Factory", value: "AGENT_TO_FACTORY" },
                { label: "Consumer to Agent", value: "CONSUMER_TO_AGENT" },
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
          ]}
        />
      </Card>
    </>
  );
};

export default OrdersPage;
