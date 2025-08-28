import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "ID",
  "Username",
  "Full Name",
  "Email",
  "Phone Number",
  "Agent Type",
  "ID Number",
  "Commission Rate",
  "Street",
  "City",
  "State",
  "Postal Code",
  "Country",
  "Is Active",
  "Bank Account Number",
  "Tax Identification Number",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.id,
    data.username,
    data.fullName,
    data.email,
    data.phoneNumber,
    data.agentType,
    data.idNumber,
    data.commissionRate,
    data.address?.street || "",
    data.address?.city || "",
    data.address?.state || "",
    data.address?.postalCode || "",
    data.address?.country || "",
    data.isActive ? "Active" : "Inactive",
    data.bankAccountNumber,
    data.taxIdentificationNumber,
    data.createdAt,
    data.updatedAt,
  ];
};

const ExportSellerDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Sellers.xlsx", { bookSST: true });
};

export default ExportSellerDataToExcel;
