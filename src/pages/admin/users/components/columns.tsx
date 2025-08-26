import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  AdminUser,
  AdminModuleType,
} from "../../../../constants/interface/admin/user";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import { CellActions } from "./cell-actions";

const getAdminTypeLabel = (type: AdminModuleType): string => {
  const labels = {
    [AdminModuleType.WEB_ADMIN]: "Web Admin",
    [AdminModuleType.AGENT_ADMIN]: "Agent Admin",
    [AdminModuleType.SELLER_ADMIN]: "Seller Admin",
    [AdminModuleType.INSTITUTION_ADMIN]: "Institution Admin",
    [AdminModuleType.MANUFACTURER_ADMIN]: "Manufacturer Admin",
    [AdminModuleType.CONSUMER_ADMIN]: "Consumer Admin",
    [AdminModuleType.FINANCE_ADMIN]: "Finance Admin",
    [AdminModuleType.INVENTORY_ADMIN]: "Inventory Admin",
    [AdminModuleType.REPORT_ADMIN]: "Report Admin",
    [AdminModuleType.SUPER_ADMIN]: "Super Admin",
  };
  return labels[type] || type;
};

export const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "userType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Admin Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("userType") as AdminModuleType;
      return <Badge variant="outline">{getAdminTypeLabel(type)}</Badge>;
    },
  },
  {
    accessorKey: "assignedOrganization",
    header: "Assigned Organization",
    cell: ({ row }) => {
      const org = row.original.assignedOrganization;
      return org ? (
        <div className="flex flex-col">
          <span className="font-medium">{org.name}</span>
          <span className="text-sm text-gray-500">{org.type}</span>
        </div>
      ) : (
        <span className="text-gray-400">None</span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive =
        row.getValue("isActive") === "true" ||
        row.getValue("isActive") === true;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={`${isActive ? "bg-green-500" : "bg-red-500"}`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes((row.getValue(id) as boolean).toString());
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
