import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import { Agent } from "../../../../constants/interface/admin/agent";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          to={`/admin/agents/${row.original.agentId}`}
          className="hover:text-underline"
        >
          <Button variant={'link'} className="text-slate-600">{row.original.name}</Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "phone",
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
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (row.original.gender === "male" ? "Male" : "Female"),
    filterFn: (row, value) => {
      if (value === "male") {
        return row.original.gender === "male";
      } else if (value === "female") {
        return row.original.gender === "female";
      }
      return true;
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "agentStatus",
    header: "Agent Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={`capitalize ${
            row.original.agentStatus === "active"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {row.original.agentStatus || "N/A"}
        </Badge>
      );
    },
    filterFn: (row, value) => {
      if (value === "active") {
        return row.original.agentStatus === "active";
      } else if (value === "inactive") {
        return row.original.agentStatus === "inactive";
      }
      return true;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
