import * as XLSX from "xlsx";
import { Consumer } from "../../../../constants/interface/admin/consumer";

const EXCEL_HEADERS: (string | number)[] = [
  "Consumer ID",
  "Institution ID",
  "Name",
  "Email",
  "Phone",
  "Age",
  "Gender",
  "City",
  "Subcity",
  "Woreda",
  "Registration Date",
  "Consumer Status",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.consumerId || "",
    data.institutionId || "",
    data.name,
    data.email,
    data.phone,
    data.age,
    data.gender,
    data.city,
    data.subcity,
    data.woreda,
    data.registrationDate,
    data.consumerStatus,
    data.createdAt || "",
    data.updatedAt || "",
  ];
};

const ExportConsumerDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Consumers.xlsx", { bookSST: true });
};

export default ExportConsumerDataToExcel;

// Create a worksheet
