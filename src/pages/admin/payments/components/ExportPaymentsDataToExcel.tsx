import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "Payment ID",
  "Payment Type",
  "Payer Name",
  "Payer Email",
  "Payee Name",
  "Payee Email",
  "Amount",
  "Currency",
  "Status",
  "Approval Status",
  "Priority",
  "Payment Method",
  "Transaction ID",
  "Reference Number",
  "Description",
  "Processing Fee",
  "Exchange Rate",
  "Created At",
  "Updated At",
  "Due Date",
  "Completed At",
  "Notes",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.id,
    data.paymentType,
    data.payer?.name || "N/A",
    data.payer?.email || "N/A",
    data.payee?.name || "N/A",
    data.payee?.email || "N/A",
    data.amount,
    data.currency,
    data.status,
    data.approvalStatus,
    data.priority,
    data.paymentMethod,
    data.transactionId || "N/A",
    data.referenceNumber || "N/A",
    data.description || "N/A",
    data.processingFee || "0",
    data.exchangeRate || "1",
    data.createdAt,
    data.updatedAt,
    data.dueDate || "N/A",
    data.completedAt || "N/A",
    data.notes || "N/A",
  ];
};

const ExportPaymentsDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "payments.xlsx", { bookSST: true });
};

export default ExportPaymentsDataToExcel;
