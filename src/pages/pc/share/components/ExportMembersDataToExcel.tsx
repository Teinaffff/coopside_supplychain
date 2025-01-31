import * as XLSX from "xlsx";

// Your dynamic data
const ExportShareDataToExcel = (filtered: string, data: any) => {
  const dynamicData = [
    [
      "Share Name",
      "Share Email",
      "Share Phone",
      "Share Address",
      "Country",
      "Country Code",
      "Total Agents",
      "Description",
      "Share Status",
      "Updated At",
      "Created At",
    ],
    ...data?.map((row: any) => [
      filtered === "filtered" ? row.original.ShareName : row.ShareName,
      filtered === "filtered" ? row.original.ShareEmail : row.ShareEmail,
      filtered === "filtered" ? row.original.SharePhone : row.SharePhone,
      filtered === "filtered" ? row.original.ShareAddress : row.ShareAddress,
      filtered === "filtered" ? row.original.country : row.country,
      filtered === "filtered" ? row.original.countryCode : row.countryCode,
      filtered === "filtered" ? row.original.totalAgents : row.totalAgents,
      filtered === "filtered" ? row.original.description : row.description,
      filtered === "filtered" ? row.original.ShareStatus : row.ShareStatus,
      filtered === "filtered" ? row.original.gate : row.gate,
      filtered === "filtered" ? row.original.terminal : row.terminal,
      filtered === "filtered" ? row.original.updatedAt : row.updatedAt,
      filtered === "filtered" ? row.original.createdAt : row.createdAt,
    ]),
    // Add more rows as needed
  ];
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);

  // Create a workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  // Save the workbook to a file
  XLSX.writeFile(wb, "Share.xlsx", { bookSST: true });
};

export default ExportShareDataToExcel;

// Create a worksheet
