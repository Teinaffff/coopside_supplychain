import * as XLSX from "xlsx";
import { AdminUser } from "../../../../constants/interface/admin/user";

const EXCEL_HEADERS: (string | number)[] = [
  "User ID",
  "Username",
  "Full Name",
  "Email",
  "Phone Number",
  "User Type",
  "Assigned Organization",
  "Organization Type",
  "Status",
  "Profile Picture URL",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data: AdminUser = filtered ? row.original : row;
  return [
    data.id || "N/A",
    data.username || "N/A",
    data.fullName || "N/A",
    data.email || "N/A",
    data.phoneNumber || "N/A",
    data.userType || "N/A",
    data.assignedOrganization?.name || "None",
    data.assignedOrganization?.type || "N/A",
    data.isActive ? "Active" : "Inactive",
    data.profilePictureUrl || "N/A",
    data.createdAt || "N/A",
    data.updatedAt || "N/A",
  ];
};

const ExportUsersDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Users.xlsx", { bookSST: true });
};

export default ExportUsersDataToExcel;
