import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "Agent Name",
  "Email",
  "Phone",
  "Age",
  "Gender",
  "City",
  "Subcity",
  "Woreda",
  "Start Date",
  "Agent Status",
  "Updated At",
  "Created At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.name,
    data.email,
    data.phone,
    data.age,
    data.gender,
    data.city,
    data.subcity,
    data.woreda,
    data.startDate,
    data.agentStatus,
    data.updatedAt,
    data.createdAt,
  ];
};

const ExportAgentsDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Agents.xlsx", { bookSST: true });
};

export default ExportAgentsDataToExcel;
