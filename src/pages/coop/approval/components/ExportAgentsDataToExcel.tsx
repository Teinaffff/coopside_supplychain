import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

const EXCEL_HEADERS: (string | number)[] = [
  "Agent Name",
  "Email",
  "Phone Number",
  "Agency Name",
  "Agency Email",
  "Agency Phone",
  "Agency Address",
  "Country",
  "Country Code",
  "Agent Status",
  "Agency Status",
  "Updated At",
  "Created At",
];

const formatRowData = (agent: any): (string | number)[] => {
  return [
    agent.name || agent.agentName || agent.fullName || "N/A",
    agent.email || "N/A",
    agent.phoneNumber || agent.phone || "N/A",
    agent.agencyName || agent.agency?.name || "N/A",
    agent.agencyEmail || agent.agency?.email || "N/A",
    agent.agencyPhone || agent.agency?.phone || "N/A",
    agent.agencyAddress || agent.agency?.address || "N/A",
    agent.country || agent.agency?.country || "N/A",
    agent.countryCode || agent.agency?.countryCode || "N/A",
    agent.status || agent.agentStatus || "N/A",
    agent.agencyStatus || agent.agency?.status || "N/A",
    agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString() : "N/A",
    agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "N/A",
  ];
};

export const ExportAgentsDataToExcel = (
  agents: any[],
  listName?: string
): void => {
  if (!agents || agents.length === 0) {
    toast.error("No agent data to export");
    return;
  }

  try {
    const dynamicData = [
      EXCEL_HEADERS,
      ...agents.map((agent) => formatRowData(agent)),
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

    XLSX.utils.book_append_sheet(wb, ws, "Agents");

    const fileName = listName 
      ? `Agents_${listName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split("T")[0]}.xlsx`
      : `Agents_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(wb, fileName, { bookSST: true });
    toast.success(`Agent data exported successfully! (${agents.length} records)`);
  } catch (error) {
    console.error("Error exporting agent data:", error);
    toast.error("Failed to export agent data");
  }
};

export default ExportAgentsDataToExcel;
