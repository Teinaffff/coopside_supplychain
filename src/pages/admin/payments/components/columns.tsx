import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/ui/button";
import StatusBadge from "../../../../common/ui/status-badge";
import { Payment } from "../../../../constants/interface/admin/payment";
import { formatCurrency } from "../../../../lib/utils";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          to={`/admin/payments/${row.original.id}`}
          className="hover:text-underline"
        >
          <Button
            variant={"link"}
            className="text-slate-600 hover:text-cyan-500 dark:text-slate-50"
          >
            {row.original.paymentId}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "paymentType",
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
      const type = row.original.paymentType;
      return (
        <span className="text-sm">
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "payer.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.payer?.name}</span>
          <span className="text-xs text-gray-500">{row.original.payer?.type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "payee.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.payee?.name}</span>
          <span className="text-xs text-gray-500">{row.original.payee?.type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {formatCurrency(row.original.amount)} {row.original.currency}
          </span>
          <span className="text-xs text-gray-500">{row.original.paymentMethod}</span>
        </div>
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
        pending: "bg-yellow-50 text-yellow-600",
        processing: "bg-blue-50 text-blue-600",
        completed: "bg-green-50 text-green-600",
        failed: "bg-red-50 text-red-600",
        cancelled: "bg-gray-50 text-gray-600",
        refunded: "bg-purple-50 text-purple-600",
      };
      return (
        <StatusBadge
          status={status}
          isActive={status === "completed" || status === "processing"}
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
    accessorKey: "relatedEntity.type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Related To
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const relatedEntity = row.original.relatedEntity;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{relatedEntity?.type}</span>
          <span className="text-xs text-gray-500">{relatedEntity?.id}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentDate = row.original.paymentDate;
      const processedDate = row.original.processedDate;
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {paymentDate ? new Date(paymentDate).toLocaleDateString() : "N/A"}
          </span>
          {processedDate && (
            <span className="text-xs text-gray-500">
              Processed: {new Date(processedDate).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    },
  },
  
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
