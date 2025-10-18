import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

const EXCEL_HEADERS: (string | number)[] = [
  "Factory Name",
  "Factory Type",
  "Email",
  "Phone Number",
  "Address",
  "Country",
  "Country Code",
  "Total Agents",
  "Description",
  "Status",
  "Updated At",
  "Created At",
];

const formatRowData = (manufacturer: any): (string | number)[] => {
  return [
    manufacturer.name || manufacturer.factoryName || "N/A",
    manufacturer.factoryType || manufacturer.type || "N/A",
    manufacturer.email || "N/A",
    manufacturer.phoneNumber || manufacturer.phone || "N/A",
    manufacturer.address || "N/A",
    manufacturer.country || "N/A",
    manufacturer.countryCode || "N/A",
    manufacturer.totalAgents || 0,
    manufacturer.description || "N/A",
    manufacturer.status || manufacturer.onboardingStatus || "N/A",
    manufacturer.updatedAt ? new Date(manufacturer.updatedAt).toLocaleDateString() : "N/A",
    manufacturer.createdAt ? new Date(manufacturer.createdAt).toLocaleDateString() : "N/A",
  ];
};

export const ExportManufacturersDataToExcel = (
  manufacturers: any[],
  listName?: string
): void => {
  if (!manufacturers || manufacturers.length === 0) {
    toast.error("No manufacturer data to export");
    return;
  }

  try {
    const dynamicData = [
      EXCEL_HEADERS,
      ...manufacturers.map((manufacturer) => formatRowData(manufacturer)),
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Set column widths
    const colWidths = EXCEL_HEADERS.map(() => ({ wch: 20 }));
    ws["!cols"] = colWidths;

    // Style header row
    const headerRange = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "E3F2FD" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    XLSX.utils.book_append_sheet(wb, ws, "Manufacturers");

    const fileName = listName 
      ? `Manufacturers_${listName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split("T")[0]}.xlsx`
      : `Manufacturers_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(wb, fileName, { bookSST: true });
    toast.success(`Manufacturer data exported successfully! (${manufacturers.length} records)`);
  } catch (error) {
    console.error("Error exporting manufacturer data:", error);
    toast.error("Failed to export manufacturer data");
  }
};

export default ExportManufacturersDataToExcel;
