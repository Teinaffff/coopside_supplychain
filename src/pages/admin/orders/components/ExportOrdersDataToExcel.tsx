import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "Order ID",
  "Order Number",
  "Order Type",
  "Buyer Name",
  "Seller Name",
  "Total Amount",
  "Status",
  "Priority",
  "Items Count",
  "Shipping Address",
  "Billing Address",
  "Payment Method",
  "Payment Status",
  "Notes",
  "Created At",
  "Updated At",
  "Expected Delivery",
  "Actual Delivery",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.id,
    data.orderNumber,
    data.orderType === "AGENT_TO_FACTORY" ? "Agent → Factory" : "Consumer → Agent",
    data.buyerName,
    data.sellerName,
    data.totalAmount,
    data.status,
    data.priority,
    data.items?.length || 0,
    data.shippingAddress ? `${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.state}` : "N/A",
    data.billingAddress ? `${data.billingAddress.street}, ${data.billingAddress.city}, ${data.billingAddress.state}` : "N/A",
    data.paymentMethod || "N/A",
    data.paymentStatus || "N/A",
    data.notes || "N/A",
    data.createdAt,
    data.updatedAt,
    data.expectedDeliveryDate || "N/A",
    data.actualDeliveryDate || "N/A",
  ];
};

const ExportOrdersDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders Data");
  XLSX.writeFile(wb, "Orders.xlsx", { bookSST: true });
};

export default ExportOrdersDataToExcel;
