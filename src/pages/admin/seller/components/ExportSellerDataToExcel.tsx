import * as XLSX from "xlsx";
import { Seller } from "../../../../constants/interface/admin/seller";

const EXCEL_HEADERS: (string | number)[] = [
  "Seller ID",
  "Name",
  "Email",
  "Phone",
  "Chairperson",
  "Member Count",
  "City",
  "Subcity",
  "Woreda",
  "Established Date",
  "Status",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.sellerId,
    data.name,
    data.email,
    data.phone,
    data.chairperson,
    data.memberCount,
    data.city,
    data.subcity,
    data.woreda,
    data.establishedDate,
    data.sellerStatus,
    data.createdAt,
    data.updatedAt,
  ];
};

const ExportSellerDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Sellers.xlsx", { bookSST: true });
};

export default ExportSellerDataToExcel;
