import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../common/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import { Download, CreditCard as CreditCardIcon, Calendar, CheckCircle, Search } from "lucide-react";
import repaymentService, { RepaymentDetailsResponse, ProcessPaymentPayload } from "../../../services/repaymentService";
import { toast } from "react-hot-toast";

const LoanRepaymentsPage = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [details, setDetails] = useState<RepaymentDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER");

  const stats = useMemo(() => {
    const totalDue = details?.totalDue || 0;
    const totalPaid = details?.totalPaid || 0;
    const outstanding = details?.outstanding ?? Math.max(totalDue - totalPaid, 0);
    return { totalDue, totalPaid, outstanding };
  }, [details]);

  const loadDetails = async () => {
    if (!applicationNumber.trim()) {
      toast.error("Enter an application number");
      return;
    }
    setIsLoading(true);
    try {
      const data = await repaymentService.getRepaymentDetails(applicationNumber.trim());
      setDetails(data);
      setPaymentAmount(Math.max((data.outstanding || 0), 0));
      toast.success("Repayment details loaded");
    } catch (err: any) {
      console.error("Failed to load repayment details", err);
      toast.error(err?.response?.data?.message || "Failed to load repayment details");
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const submitPayment = async () => {
    if (!details?.applicationNumber) return;
    if (paymentAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const payload: ProcessPaymentPayload = {
      loanApplicationNumber: details.applicationNumber,
      amount: paymentAmount,
      paymentMethod: paymentMethod,
    };
    try {
      await repaymentService.processPayment(payload);
      toast.success("Payment processed");
      setShowPaymentDialog(false);
      await loadDetails();
    } catch (err: any) {
      console.error("Payment failed", err);
      toast.error(err?.response?.data?.message || "Payment failed");
    }
  };

  const exportCSV = () => {
    try {
      const rows: any[] = [];
      details?.schedule?.forEach(s => {
        rows.push({
          Type: "Schedule",
          Installment: s.installmentNo,
          DueDate: s.dueDate,
          Amount: s.amount,
          Status: s.status || "N/A",
          PaidAmount: s.paidAmount || 0,
        });
      });
      details?.payments?.forEach(p => {
        rows.push({
          Type: "Payment",
          Id: p.id || "",
          Date: p.date,
          Amount: p.amount,
          Method: p.method || "",
          Status: p.status || "",
        });
      });
      if (rows.length === 0) {
        toast.error("No data to export");
        return;
      }
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(","), ...rows.map(r => headers.map(h => `${r[h] ?? ""}`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `repayments-${details?.applicationNumber || applicationNumber || "export"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Exported CSV");
    } catch (e) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repayments</h1>
          <p className="text-gray-600">Manage and track loan repayments</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={exportCSV}
            className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600"
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Enter application number"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={loadDetails} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {isLoading ? "Loading..." : "Load Details"}
            </Button>
            <Button
              disabled={!details}
              onClick={() => setShowPaymentDialog(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Record Repayment
            </Button>
          </div>
        </CardContent>
      </Card>

      {details && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB {stats.totalDue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all installments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">ETB {stats.totalPaid.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Payments received</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB {stats.outstanding.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Remaining balance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Repayment Schedule</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Installment</th>
                      <th className="px-4 py-3 font-medium">Due Date</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.schedule?.map((s) => (
                      <tr key={s.installmentNo} className="border-t border-slate-100">
                        <td className="px-4 py-3">#{s.installmentNo}</td>
                        <td className="px-4 py-3">{s.dueDate}</td>
                        <td className="px-4 py-3">ETB {s.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{s.status || "DUE"}</Badge>
                        </td>
                        <td className="px-4 py-3">{s.paidAmount ? `ETB ${s.paidAmount.toLocaleString()}` : "-"}</td>
                      </tr>
                    ))}
                    {(!details.schedule || details.schedule.length === 0) && (
                      <tr>
                        <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No schedule available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Payments</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Payment ID</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.payments?.map((p, idx) => (
                      <tr key={p.id || idx} className="border-t border-slate-100">
                        <td className="px-4 py-3">{p.id || "-"}</td>
                        <td className="px-4 py-3">{p.date}</td>
                        <td className="px-4 py-3">ETB {p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">{p.method || "-"}</td>
                        <td className="px-4 py-3">{p.status || "POSTED"}</td>
                      </tr>
                    ))}
                    {(!details.payments || details.payments.length === 0) && (
                      <tr>
                        <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No payments recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Repayment</DialogTitle>
            <DialogDescription>
              Process a loan repayment payment for application {details?.applicationNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ETB)</label>
              <Input type="number" min="0" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={submitPayment} className="bg-cyan-600 hover:bg-cyan-700 text-white">Submit Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanRepaymentsPage;

