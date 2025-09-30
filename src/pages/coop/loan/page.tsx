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

type LoanOverview = {
  loanID: string;
  borrower: string;
  loanAmount: number;
  approvalDate: string;
  dueDate: string;
};

type LoanStatusItem = {
  status: string;
  pevor: string;
  disbursed: string;
  riskRating: string;
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

const loansOverview: LoanOverview[] = [
  { loanID: "LN0001", borrower: "John Doe", loanAmount: 5000, approvalDate: "11/20/2020", dueDate: "2/1/2020" },
  { loanID: "LN0002", borrower: "Jane Smith", loanAmount: 50000, approvalDate: "11/16/2020", dueDate: "1/15/2020" },
  { loanID: "LN0003", borrower: "Robert Brown", loanAmount: 4500, approvalDate: "12/9/2020", dueDate: "3/12/2020" },
  { loanID: "LN0004", borrower: "Linda Johnson", loanAmount: 15000, approvalDate: "11/04/2020", dueDate: "3/1/2020" },
  { loanID: "LN0005", borrower: "William Jones", loanAmount: 5000, approvalDate: "11/24/2020", dueDate: "3/26/2020" },
];

const loanStatusDistributionData: LoanStatusItem[] = [
  { status: "Pending", pevor: "Pevor", disbursed: "Disbursed", riskRating: "High" },
  { status: "Overdue", pevor: "Overdue", disbursed: "High", riskRating: "Low" },
  { status: "Disbursed", pevor: "Meson", disbursed: "C304", riskRating: "Medium" },
  { status: "Closed", pevor: "Closed", disbursed: "B684", riskRating: "Medium" },
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

const LoansOverviewColumns: ColumnDef<LoanOverview>[] = [
  { accessorKey: "loanID", header: "Loan ID" },
  { accessorKey: "borrower", header: "Borrower" },
  { accessorKey: "loanAmount", header: "Loan Amount" },
  { accessorKey: "approvalDate", header: "Approval Date" },
  { accessorKey: "dueDate", header: "Due Date" },
];

const LoanStatusDistributionColumns: ColumnDef<LoanStatusItem>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "pevor", header: "Pevor" },
  { accessorKey: "disbursed", header: "Disbursed" },
  { accessorKey: "riskRating", header: "Risk Rating" },
];

const LoanManagementPage: React.FC = () => {
  const [totalActiveLoans, setTotalActiveLoans] = useState(25);
  const [totalOutstanding, setTotalOutstanding] = useState(150000);
  const [defaultRate, setDefaultRate] = useState(5);
  const [loansSearchTerm, setLoansSearchTerm] = useState("");
  const [loanStatusSearchTerm, setLoanStatusSearchTerm] = useState("");

  const filteredLoans = useMemo(() => {
    return loansOverview.filter((loan) =>
      loan.borrower.toLowerCase().includes(loansSearchTerm.toLowerCase())
    );
  }, [loansSearchTerm]);

  const filteredLoanStatus = useMemo(() => {
    return loanStatusDistributionData.filter((item) =>
      item.status.toLowerCase().includes(loanStatusSearchTerm.toLowerCase())
    );
  }, [loanStatusSearchTerm]);

  const exportLoansToCSV = (fileName: string, rows: any[]) => {
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

  const exportToExcel = (sheetName: string, rows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(
      wb,
      `${sheetName.toLowerCase()}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
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
    <div className="space-y-6 p-4">
      {/* Loan Monitoring Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Monitoring</h1>

      {/* Loan Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveLoans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatETB(totalOutstanding)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Loans Table and Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Loans</CardTitle>
          </CardHeader>
          <CardContent>
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

        {/* Loan Status Distribution (Pie Chart & Table) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Pie Chart Placeholder */}
              <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #3B82F6 0% 35%,
                      #60A5FA 35% 63%,
                      #93C5FD 63% 88%,
                      #BFDBFE 88% 100%
                    )`
                  }}
                ></div>
              </div>
              {/* Pie Chart Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                <div className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded-full bg-[#3B82F6]"></span>
                  <span className="text-sm">Pending (35%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded-full bg-[#60A5FA]"></span>
                  <span className="text-sm">Approved (28%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded-full bg-[#93C5FD]"></span>
                  <span className="text-sm">Disbursed (25%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-3 w-3 rounded-full bg-[#BFDBFE]"></span>
                  <span className="text-sm">Closed (38%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Loans</CardTitle>
              <Button size="sm" className="border" onClick={() => exportLoansToCSV("loan_status_distribution", filteredLoanStatus)}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search loans..."
                  value={loanStatusSearchTerm}
                  onChange={(e) => setLoanStatusSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <DataTable
                columns={LoanStatusDistributionColumns}
                data={filteredLoanStatus}
                searchKey="status"
                searchPlaceholder="status"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Loan Management Tabs */}
      {/* <Card>
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
      </Card> */}
    </div>
  );
};

export default LoanManagementPage;


