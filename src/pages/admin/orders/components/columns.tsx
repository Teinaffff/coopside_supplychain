import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/ui/button";
import StatusBadge from "../../../../common/ui/status-badge";
import { Order } from "../../../../constants/interface/admin/order";
import { CellActions } from "./cell-actions";
import { formatCurrency } from "../../../../lib/utils";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          to={`/admin/orders/${row.original.id}`}
          className="hover:text-underline"
        >
          <Button
            variant={"link"}
            className="text-slate-600 hover:text-cyan-500 dark:text-slate-50"
          >
            {row.original.orderNumber}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.original.orderType;
      return (
        <span className="text-sm">
          {type === "AGENT_TO_FACTORY" ? "Agent → Factory" : "Consumer → Agent"}
        </span>
      );
    },
  },
  {
    accessorKey: "buyerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Buyer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sellerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Seller
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {formatCurrency(row.original.totalAmount)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
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
      const status = row.original.status;
      const statusColors = {
        PENDING: "bg-yellow-50 text-yellow-600",
        CONFIRMED: "bg-blue-50 text-blue-600",
        PROCESSING: "bg-purple-50 text-purple-600",
        SHIPPED: "bg-indigo-50 text-indigo-600",
        DELIVERED: "bg-green-50 text-green-600",
        RETURNED: "bg-red-50 text-red-600",
      };
      return (
        <StatusBadge
          status={status}
          isActive={status !== "CANCELLED" && status !== "RETURNED"}
          className={statusColors[status as keyof typeof statusColors]}
        />
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes(row.getValue(id) as string);
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.original.priority;
      const priorityColors = {
        LOW: "text-green-600 bg-green-50",
        MEDIUM: "text-yellow-600 bg-yellow-50",
        HIGH: "text-orange-600 bg-orange-50",
        URGENT: "text-red-600 bg-red-50",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority as keyof typeof priorityColors]}`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-500">
          {new Date(row.original.createdAt!).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
