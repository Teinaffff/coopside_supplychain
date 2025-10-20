import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Download, LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";
import { Button } from "./button";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface FacetedFilterConfig<TData> {
  columnId: string;
  title: string;
  options: { label: string; value: any }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  searchPlaceholder?: string;
  clickable?: boolean;
  onConfirmFunction?: (data: TData[]) => void;
  getSelectedRow?: (data: TData) => void;
  buttonTitle?: string;
  ButtonIcon?: LucideIcon;
  onExport?: (filtered: string, data: Row<TData>[]) => void;
  facetedFilters?: FacetedFilterConfig<TData>[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  clickable,
  onConfirmFunction,
  getSelectedRow,
  buttonTitle,
  ButtonIcon,
  onExport,
  facetedFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);

  const userAuthorities = localStorage.getItem("authorities");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const onConfirm = async () => {
    try {
      setLoading(true);
      const selectedDataToDelete = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);

      if (selectedDataToDelete.length > 0 && onConfirmFunction) {
        onConfirmFunction(selectedDataToDelete);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-accent">
              {headerGroup.headers.map((header) => {
                const align = (header.column.columnDef as any)?.meta?.align as
                  | "left"
                  | "center"
                  | "right"
                  | undefined;
                const headAlignClass =
                  align === "right"
                    ? "text-right"
                    : align === "center"
                    ? "text-center"
                    : "text-left";
                return (
                  <TableHead key={header.id} className={headAlignClass}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`${clickable && "cursor-pointer"}`}
                onClick={() => clickable && getSelectedRow?.(row.original)}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef as any)?.meta?.align as
                    | "left"
                    | "center"
                    | "right"
                    | undefined;
                  const cellAlignStyle =
                    align === "right"
                      ? { textAlign: "right" as const }
                      : align === "center"
                      ? { textAlign: "center" as const }
                      : { textAlign: "left" as const };
                  return (
                    <TableCell key={cell.id} style={cellAlignStyle}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
