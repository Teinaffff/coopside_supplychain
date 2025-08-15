import * as XLSX from "xlsx";
import { Manufacturer } from "../../../../constants/interface/admin/manufacturer";

const EXCEL_HEADERS: (string | number)[] = [
  "Manufacturer ID",
  "Name",
  "Email",
  "Phone",
  "Contact Person",
  "Business Type",
  "City",
  "Subcity",
  "Woreda",
  "Established Date",
  "Manufacturer Status",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.manufacturerId || "",
    data.name,
    data.email,
    data.phone,
    data.contactPerson,
    data.businessType,
    data.city,
    data.subcity,
    data.woreda,
    data.establishedDate,
    data.manufacturerStatus,
    data.createdAt || "",
    data.updatedAt || "",
  ];
};

const ExportManufacturersDataToExcel = (filtered: string, data: any[]): void => {
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