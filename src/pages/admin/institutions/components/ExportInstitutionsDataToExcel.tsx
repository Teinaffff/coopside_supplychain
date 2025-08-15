import * as XLSX from "xlsx";
import { Institution } from "../../../../constants/interface/admin/institution";

const EXCEL_HEADERS: (string | number)[] = [
  "Institution Name",
  "Institution Email",
  "Institution Phone",
  "Institution Type",
  "Contact Person",
  "City",
  "Subcity",
  "Woreda",
  "Established Date",
  "Institution Status",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.name,
    data.email,
    data.phone,
    data.institutionType,
    data.contactPerson,
    data.city,
    data.subcity,
    data.woreda,
    data.establishedDate,
    data.institutionStatus,
  ];
};

const ExportInstitutionDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Institutions.xlsx", { bookSST: true });
};

export default ExportInstitutionDataToExcel;
