import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

const EXCEL_HEADERS: (string | number)[] = [
  "Institution Name",
  "Email",
  "Phone Number",
  "Address",
  "Country",
  "Country Code",
  "Total Consumers",
  "Description",
  "Status",
  "Updated At",
  "Created At",
];

const formatRowData = (institution: any): (string | number)[] => {
  return [
    institution.name || institution.fullLegalName || institution.institutionName || "N/A",
    institution.email || "N/A",
    institution.phoneNumber || institution.phone || "N/A",
    institution.address || "N/A",
    institution.country || "N/A",
    institution.countryCode || "N/A",
    institution.totalConsumers || institution.consumerCount || 0,
    institution.description || "N/A",
    institution.status || institution.onboardingStatus || "N/A",
    institution.updatedAt ? new Date(institution.updatedAt).toLocaleDateString() : "N/A",
    institution.createdAt ? new Date(institution.createdAt).toLocaleDateString() : "N/A",
  ];
};

export const ExportInstitutionsDataToExcel = (
  institutions: any[],
  listName?: string
): void => {
  if (!institutions || institutions.length === 0) {
    toast.error("No institution data to export");
    return;
  }

  try {
    const dynamicData = [
      EXCEL_HEADERS,
      ...institutions.map((institution) => formatRowData(institution)),
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

    XLSX.utils.book_append_sheet(wb, ws, "Institutions");

    const fileName = listName 
      ? `Institutions_${listName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split("T")[0]}.xlsx`
      : `Institutions_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(wb, fileName, { bookSST: true });
    toast.success(`Institution data exported successfully! (${institutions.length} records)`);
  } catch (error) {
    console.error("Error exporting institution data:", error);
    toast.error("Failed to export institution data");
  }
};

export default ExportInstitutionsDataToExcel;
