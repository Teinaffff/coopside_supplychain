import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "Agency Name",
  "Agency Email",
  "Agency Phone",
  "Agency Address",
  "Country",
  "Country Code",
  "Total Agents",
  "Description",
  "Agency Status",
  "Updated At",
  "Created At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.agencyName,
    data.agencyEmail,
    data.agencyPhone,
    data.agencyAddress,
    data.country,
    data.countryCode,
    data.totalAgents,
    data.description,
    data.agencyStatus,
    data.updatedAt,
    data.createdAt,
  ];
};

const ExportAgencyDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Member.xlsx", { bookSST: true });
};

export default ExportAgencyDataToExcel;
