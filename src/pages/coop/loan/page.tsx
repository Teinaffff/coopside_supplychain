import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { DataTable } from "../../../common/ui/data-table";
import { Badge } from "../../../common/ui/badge";
import { Button } from "../../../common/ui/button";
import { Download, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { Input } from "../../../common/ui/input";

type AgentLoan = {
  id: string;
  applicationNumber: string;
  agentId: string;
  agentName: string;
  factoryId?: string;

  loanAmount: number;
  approvedAmount: number;
  outstandingAmount: number;
  salesAmount: number;

  interestRate: number;
  tenureMonths: number;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED" | "CLOSED";
  statusRemarks?: string;

  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  disbursedAt?: string;
};

type CustomerLoan = {
  id: string;
  customerName: string;
  loanAmount: number;
  paidAmount: number;
  status: "pending" | "approved" | "disbursed" | "closed" | "rejected";
};

type LoanOverview = {
  loanID: string;
  borrower: string;
  loanAmount: number;
  approvalDate: string;
  dueDate: string;
};

const agentLoans: AgentLoan[] = [
  {
    id: "a-001",
    applicationNumber: "LN-2025-001",
    agentId: "AG001",
    agentName: "Abebaw Tadesse",
    loanAmount: 600000,
    approvedAmount: 580000,
    outstandingAmount: 160000,
    salesAmount: 420000,
    interestRate: 5,
    tenureMonths: 12,
    status: "APPROVED",
    createdAt: "2025-09-01T09:00:00Z",
  },
  {
    id: "a-002",
    applicationNumber: "LN-2025-002",
    agentId: "AG002",
    agentName: "Lulit Bekele",
    loanAmount: 300000,
    approvedAmount: 300000,
    outstandingAmount: 105000,
    salesAmount: 195000,
    interestRate: 4.5,
    tenureMonths: 10,
    status: "DISBURSED",
    createdAt: "2025-09-03T11:15:00Z",
  },
];

const customerLoans: CustomerLoan[] = [
  { id: "c-101", customerName: "Selamawit D.", loanAmount: 55000, paidAmount: 18000, status: "pending" },
  { id: "c-102", customerName: "Mebratu G.", loanAmount: 120000, paidAmount: 66000, status: "approved" },
  { id: "c-103", customerName: "Marta K.", loanAmount: 75000, paidAmount: 54000, status: "disbursed" },
  { id: "c-104", customerName: "Samuel T.", loanAmount: 220000, paidAmount: 220000, status: "closed" },
  { id: "c-105", customerName: "Tsion A.", loanAmount: 45000, paidAmount: 9000, status: "rejected" },
];

const loansOverview: LoanOverview[] = [
  { loanID: "LN0001", borrower: "John Doe", loanAmount: 5000, approvalDate: "11/20/2020", dueDate: "2/1/2020" },
  { loanID: "LN0002", borrower: "Jane Smith", loanAmount: 50000, approvalDate: "11/16/2020", dueDate: "1/15/2020" },
  { loanID: "LN0003", borrower: "Robert Brown", loanAmount: 4500, approvalDate: "12/9/2020", dueDate: "3/12/2020" },
];

const formatETB = (value: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(value);

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

const LoansOverviewColumns: ColumnDef<LoanOverview>[] = [
  { accessorKey: "loanID", header: "Loan ID" },
  { accessorKey: "borrower", header: "Borrower" },
  { accessorKey: "loanAmount", header: "Loan Amount" },
  { accessorKey: "approvalDate", header: "Approval Date" },
  { accessorKey: "dueDate", header: "Due Date" },
];

const LoanManagementPage: React.FC = () => {
  const [totalActiveLoans] = useState(25);
  const [totalOutstanding] = useState(150000);
  const [defaultRate] = useState(5);
  const [loansSearchTerm, setLoansSearchTerm] = useState("");

  const filteredLoans = useMemo(() => {
    return loansOverview.filter((loan) =>
      loan.borrower.toLowerCase().includes(loansSearchTerm.toLowerCase())
    );
  }, [loansSearchTerm]);

  const exportToExcel = (sheetName: string, rows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName.toLowerCase()}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Loan Monitoring Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Monitoring</h1>

      {/* Loan Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Active Loans</CardTitle>
            
          </CardHeader>
          <CardContent className="pr-0">
            <div className="text-2xl font-bold">{totalActiveLoans}</div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent className="pr-0">
            <div className="text-2xl font-bold">{formatETB(totalOutstanding)}</div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
          </CardHeader>
          <CardContent className="pr-0">
            <div className="text-2xl font-bold">{defaultRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Loans Overview Table */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loans Overview</CardTitle>
          <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => exportToExcel("LoansOverview", filteredLoans)}
      >
        <Download className="mr-1 h-4 w-4" /> Excel
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => exportToCSV(filteredLoans)}
      >
        <Download className="mr-1 h-4 w-4" /> CSV
      </Button>
    </div>
        </CardHeader>
        <CardContent className="pr-0">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search borrower..."
              value={loansSearchTerm}
              onChange={(e) => setLoansSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable
            columns={LoansOverviewColumns}
            data={filteredLoans}
            searchKey="borrower"
            searchPlaceholder="borrower name"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanManagementPage;
