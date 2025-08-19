import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "ID",
  "Factory Name",
  "Factory Code",
  "Factory Type",
  "Email",
  "Phone Number",
  "Contact Person",
  "Number of Employees",
  "TIN Number",
  "Street",
  "City",
  "State",
  "Postal Code",
  "Country",
  "Bank Name",
  "Account Number",
  "Account Holder Name",
  "Swift Code",
  "Established Date",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.id || "",
    data.factoryName || "",
    data.factoryCode || "",
    data.factoryType || "",
    data.email || "",
    data.phoneNumber || "",
    data.contactPerson || "",
    data.numberOfEmployees || 0,
    data.tinNumber || "",
    data.address?.street || "",
    data.address?.city || "",
    data.address?.state || "",
    data.address?.postalCode || "",
    data.address?.country || "",
    data.bankAccountInfo?.bankName || "",
    data.bankAccountInfo?.accountNumber || "",
    data.bankAccountInfo?.accountHolderName || "",
    data.bankAccountInfo?.swiftCode || "",
    data.establishedDate || "",
    data.createdAt || "",
    data.updatedAt || "",
  ];
};

const ExportManufacturersDataToExcel = (
  filtered: string,
  data: any[]
): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Manufacturers.xlsx", { bookSST: true });
};

export default ExportManufacturersDataToExcel;
