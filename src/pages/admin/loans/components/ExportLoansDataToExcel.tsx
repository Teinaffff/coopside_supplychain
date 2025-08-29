import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "Loan ID",
  "Loan Type",
  "Borrower Name",
  "Borrower Type",
  "Borrower Email",
  "Borrower Phone",
  "Lender Name",
  "Lender Type",
  "Amount",
  "Currency",
  "Interest Rate (%)",
  "Term (Months)",
  "Status",
  "Purpose",
  "Disbursement Date",
  "Maturity Date",
  "Outstanding Balance",
  "Monthly Payment",
  "Next Payment Date",
  "Collateral",
  "Guarantor",
  "Approved By",
  "Approved Date",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.loanId || "N/A",
    data.loanType || "N/A",
    data.borrower?.name || "N/A",
    data.borrower?.type || "N/A",
    data.borrower?.email || "N/A",
    data.borrower?.phone || "N/A",
    data.lender?.name || "N/A",
    data.lender?.type || "N/A",
    data.amount || 0,
    data.currency || "ETB",
    data.interestRate || 0,
    data.term || 0,
    data.status || "N/A",
    data.purpose || "N/A",
    data.disbursementDate || "Not disbursed",
    data.maturityDate || "N/A",
    data.outstandingBalance || 0,
    data.monthlyPayment || 0,
    data.nextPaymentDate || "N/A",
    data.collateral || "N/A",
    data.guarantor || "N/A",
    data.approvedBy || "Not approved",
    data.approvedDate || "Not approved",
    data.createdAt || "N/A",
    data.updatedAt || "N/A",
  ];
};

const ExportLoansDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Loans.xlsx", { bookSST: true });
};

export default ExportLoansDataToExcel;