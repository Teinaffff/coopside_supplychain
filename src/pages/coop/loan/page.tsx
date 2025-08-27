import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { DataTable } from "../../../common/ui/data-table";
import { Badge } from "../../../common/ui/badge";
import { Button } from "../../../common/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

type AgentLoan = {
  id: string;
  agentName: string;
  loanAmount: number; // total loan owed
  salesAmount: number; // sales done so far (used to repay)
};

type CustomerLoan = {
  id: string;
  customerName: string;
  loanAmount: number; // total
  paidAmount: number; // paid so far
  status: "pending" | "approved" | "rejected" | "disbursed" | "closed";
};

const agentLoans: AgentLoan[] = [
  { id: "a-001", agentName: "Abebaw Tadesse", loanAmount: 600000, salesAmount: 420000 },
  { id: "a-002", agentName: "Lulit Bekele", loanAmount: 300000, salesAmount: 195000 },
  { id: "a-003", agentName: "Kebede Alemu", loanAmount: 900000, salesAmount: 820000 },
  { id: "a-004", agentName: "Hanna Mulu", loanAmount: 200000, salesAmount: 98000 },
  { id: "a-005", agentName: "Biruk Hailu", loanAmount: 480000, salesAmount: 505000 },
];

const customerLoans: CustomerLoan[] = [
  { id: "c-101", customerName: "Selamawit D.", loanAmount: 55000, paidAmount: 18000, status: "pending" },
  { id: "c-102", customerName: "Mebratu G.", loanAmount: 120000, paidAmount: 66000, status: "approved" },
  { id: "c-103", customerName: "Marta K.", loanAmount: 75000, paidAmount: 54000, status: "disbursed" },
  { id: "c-104", customerName: "Samuel T.", loanAmount: 220000, paidAmount: 220000, status: "closed" },
  { id: "c-105", customerName: "Tsion A.", loanAmount: 45000, paidAmount: 9000, status: "rejected" },
];

const formatETB = (value: number) => new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
}).format(value);

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    active: { label: "Active", variant: "default" },
    overdue: { label: "Overdue", variant: "destructive" },
    closed: { label: "Closed", variant: "secondary" },
    pending: { label: "Pending", variant: "outline" },
    approved: { label: "Approved", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
    disbursed: { label: "Disbursed", variant: "secondary" },
  };
  const v = map[status] ?? { label: status, variant: "outline" };
  return <Badge variant={v.variant}>{v.label}</Badge>;
};

const LinearProgress = ({ percent }: { percent: number }) => {
  const p = Math.min(100, Math.max(0, Math.round(percent)));
  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="h-2 w-32 rounded bg-muted overflow-hidden">
        <div className="h-full bg-cyan-600" style={{ width: `${p}%` }} />
      </div>
      <span className="text-xs font-medium">{p}%</span>
    </div>
  );
};

const computeAgentProgress = (loanAmount: number, salesAmount: number) => {
  if (loanAmount <= 0) return 100;
  return Math.min(100, (salesAmount / loanAmount) * 100);
};

const computeAgentStatus = (loanAmount: number, salesAmount: number) => {
  return salesAmount >= loanAmount ? "closed" : "active";
};

const AgentColumns: ColumnDef<AgentLoan>[] = [
  { accessorKey: "agentName", header: "Agent" },
  {
    accessorKey: "loanAmount",
    header: "Loan (ETB)",
    cell: ({ row }) => formatETB(row.original.loanAmount),
  },
  {
    accessorKey: "salesAmount",
    header: "Sales (ETB)",
    cell: ({ row }) => formatETB(row.original.salesAmount),
  },
  {
    id: "remainingLoan",
    header: "Remaining (ETB)",
    cell: ({ row }) => formatETB(Math.max(0, row.original.loanAmount - row.original.salesAmount)),
  },
  {
    id: "agentProgress",
    header: "Loan Progress",
    cell: ({ row }) => (
      <LinearProgress percent={computeAgentProgress(row.original.loanAmount, row.original.salesAmount)} />
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => statusBadge(computeAgentStatus(row.original.loanAmount, row.original.salesAmount)),
  },
];

const CustomerColumns: ColumnDef<CustomerLoan>[] = [
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "loanAmount",
    header: "Loan (ETB)",
    cell: ({ row }) => formatETB(row.original.loanAmount),
  },
  {
    accessorKey: "paidAmount",
    header: "Paid (ETB)",
    cell: ({ row }) => formatETB(row.original.paidAmount),
  },
  {
    id: "remaining",
    header: "Remaining (ETB)",
    cell: ({ row }) => formatETB(Math.max(0, row.original.loanAmount - row.original.paidAmount)),
  },
  {
    id: "customerProgress",
    header: "Progress",
    cell: ({ row }) => (
      <LinearProgress percent={(row.original.paidAmount / Math.max(1, row.original.loanAmount)) * 100} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => statusBadge(row.original.status),
  },
];

const LoanManagementPage: React.FC = () => {
  const exportToExcel = (sheetName: string, rows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(
      wb,
      `${sheetName.toLowerCase()}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportToCSV = (fileName: string, rows: any[]) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const escape = (val: any) => {
      const s = String(val ?? "");
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape((r as any)[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.toLowerCase()}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const customerRows = customerLoans.map((c) => ({
    id: c.id,
    customerName: c.customerName,
    loanAmount: c.loanAmount,
    paidAmount: c.paidAmount,
    remaining: Math.max(0, c.loanAmount - c.paidAmount),
    progressPercent: Math.round((c.paidAmount / Math.max(1, c.loanAmount)) * 100),
    status: c.status,
  }));

  const agentRows = agentLoans.map((a) => ({
    id: a.id,
    agentName: a.agentName,
    loanAmount: a.loanAmount,
    salesAmount: a.salesAmount,
    remaining: Math.max(0, a.loanAmount - a.salesAmount),
    progressPercent: Math.round(computeAgentProgress(a.loanAmount, a.salesAmount)),
    status: computeAgentStatus(a.loanAmount, a.salesAmount),
  }));
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customers">
            <TabsList>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
            </TabsList>

            <TabsContent value="customers">
              <div className="mt-2">
                <div className="w-full flex items-center justify-end gap-2 mb-2">
                  <Button size="sm" className="border" variant="secondary" onClick={() => exportToCSV("customers_loan", customerRows)}>
                    <Download className="mr-2 h-4 w-4" /> CSV
                  </Button>
                  <Button size="sm" className="border" onClick={() => exportToExcel("Customers", customerRows)}>
                    <Download className="mr-2 h-4 w-4" /> Excel
                  </Button>
                </div>
                <DataTable
                  columns={CustomerColumns}
                  data={customerLoans}
                  searchKey="customerName"
                  searchPlaceholder="customer name"
                />
              </div>
            </TabsContent>

            <TabsContent value="agents">
              <div className="mt-2">
                <div className="w-full flex items-center justify-end gap-2 mb-2">
                  <Button size="sm" className="border" variant="secondary" onClick={() => exportToCSV("agents_loan", agentRows)}>
                    <Download className="mr-2 h-4 w-4" /> CSV
                  </Button>
                  <Button size="sm" className="border" onClick={() => exportToExcel("Agents", agentRows)}>
                    <Download className="mr-2 h-4 w-4" /> Excel
                  </Button>
                </div>
                <DataTable
                  columns={AgentColumns}
                  data={agentLoans}
                  searchKey="agentName"
                  searchPlaceholder="agent name"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanManagementPage;


