import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import StatusBadge from "../../../../common/ui/status-badge";
import { Loan } from "../../../../constants/interface/admin/loan";
import { formatCurrency, formatTime } from "../../../../lib/utils";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<Loan>[] = [
  {
    accessorKey: "loanId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loan ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          to={`/admin/loans/${row.original.id}`}
          className="hover:text-underline"
        >
          <Button
            variant={"link"}
            className="text-slate-600 hover:text-cyan-500 dark:text-slate-50"
          >
            {row.original.loanId}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "loanType",
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
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("loanType")}</Badge>
    ),
  },
  {
    accessorKey: "borrower",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Borrower
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const borrower = row.getValue("borrower") as Loan["borrower"];
      return (
        <div>
          <div className="font-medium">{borrower.name}</div>
          <div className="text-sm text-muted-foreground">{borrower.type}</div>
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
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      return <div className="font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "outstandingBalance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Outstanding
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("outstandingBalance"));
      const currency = row.original.currency;
      return <div className="font-medium">{formatCurrency(balance)}</div>;
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
      const status = row.getValue("status") as string;
      return <StatusBadge isActive={status === "true"} status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "disbursementDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Disbursement Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("disbursementDate") as string;
      return date ? formatTime(date).shortDate : "Not disbursed";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
