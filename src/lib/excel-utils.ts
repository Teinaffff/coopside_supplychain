import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import { ExpectedColumn } from "../constants/general";

export const DEFAULT_CONFIG = {
  maxRows: 1000,
  batchSize: 50,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  batchDelay: 100,
};

export const validateFile = (file: File, config = DEFAULT_CONFIG): boolean => {
  if (file.size > config.maxFileSize) {
    toast.error(
      `File too large. Maximum size is ${config.maxFileSize / (1024 * 1024)}MB.`
    );
    return false;
  }

  if (!file.name.match(/\.(xlsx|xls)$/)) {
    toast.error("Please select a valid Excel file (.xlsx or .xls)");
    return false;
  }

  return true;
};

export const parseExcelFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (jsonData.length < 2) {
    throw new Error(
      "Excel file must contain at least a header row and one data row"
    );
  }

  const headers = jsonData[0] as string[];
  const rows = jsonData.slice(1);

  return { headers, rows };
};

export const mapColumns = (
  headers: string[],
  expectedColumns: ExpectedColumn[]
): Record<string, string> => {
  const mapping: Record<string, string> = {};

  expectedColumns.forEach((col) => {
    const found = headers.find(
      (h) =>
        h.toLowerCase().replace(/[\s_]/g, "") ===
        col.field.toLowerCase().replace(/[\s_]/g, "")
    );
    if (found) {
      mapping[col.field] = found;
    }
  });

  return mapping;
};

export const generateTemplate = (
  expectedColumns: ExpectedColumn[],
  templateData: any[][] = [],
  fileName: string
) => {
  const headers = expectedColumns.map((col) => col.field);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...templateData]);

  // Set column widths
  const colWidths = headers.map(() => ({ wch: 20 }));
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

  XLSX.utils.book_append_sheet(wb, ws, "Template");

  const fullFileName = `${fileName}_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(wb, fullFileName);

  toast.success("Template downloaded successfully!");
};
