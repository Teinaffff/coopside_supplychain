import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

const EXCEL_HEADERS: (string | number)[] = [
  "Full Name",
  "Email",
  "Phone Number",
  "Department",
  "National ID",
  "Admin Status",
  "Super Admin Status",
  "Created At",
  "Institution ID",
];

const formatRowData = (consumer: any): (string | number)[] => {
  return [
    consumer.fullName || "N/A",
    consumer.email || "N/A",
    consumer.phoneNumber || "N/A",
    consumer.department || "N/A",
    consumer.nationalId || "N/A",
    consumer.adminStatus || "N/A",
    consumer.status || "N/A",
    consumer.createdAt ? new Date(consumer.createdAt).toLocaleDateString() : "N/A",
    consumer.institutionId || "N/A",
  ];
};

export const ExportConsumersDataToExcel = (
  consumers: any[],
  institutionName?: string
): void => {
  if (!consumers || consumers.length === 0) {
    toast.error("No consumer data to export");
    return;
  }

  try {
    const dynamicData = [
      EXCEL_HEADERS,
      ...consumers.map((consumer) => formatRowData(consumer)),
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

    XLSX.utils.book_append_sheet(wb, ws, "Consumers");

    const fileName = institutionName 
      ? `Consumers_${institutionName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split("T")[0]}.xlsx`
      : `Consumers_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(wb, fileName, { bookSST: true });
    toast.success(`Consumer data exported successfully! (${consumers.length} records)`);
  } catch (error) {
    console.error("Error exporting consumer data:", error);
    toast.error("Failed to export consumer data");
  }
};

export default ExportConsumersDataToExcel;
