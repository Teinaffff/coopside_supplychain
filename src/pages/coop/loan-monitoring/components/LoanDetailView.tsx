import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../common/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  User, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Package,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Download,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../common/ui/dialog";
import { Textarea } from "../../../../common/ui/textarea";
import { Label } from "../../../../common/ui/label";
import { toast } from "react-hot-toast";

type LoanApplication = {
  applicationNumber: string;
  loanType: string;
  status: "DRAFT" | "PENDING_PARTNER_APPROVAL" | "PENDING_SUPER_ADMIN_APPROVAL" | "APPROVED" | "REJECTED" | "DISBURSED" | "CANCELLED";
  requestedAmount: number;
  approvedAmount?: number;
  tenure: number;
  products: number;
  created: string;
  factoryId?: string;
  agentId?: string;
  borrowerName?: string;
  interestRate?: number;
  purpose?: string;
  documents?: any[];
  riskScore?: number;
  borrowerDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    nationalId: string;
    employer: string;
    tin: string;
  };
  productDetails?: {
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  paymentSchedule?: {
    installment: number;
    dueDate: string;
    principal: number;
    interest: number;
    total: number;
    status: "PENDING" | "PAID" | "OVERDUE";
  }[];
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
  }[];
};

interface LoanDetailViewProps {
  application: LoanApplication;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (applicationNumber: string) => void;
  onReject: (applicationNumber: string, reason: string) => void;
}

const LoanDetailView: React.FC<LoanDetailViewProps> = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DISBURSED: { variant: "default" as const, color: "bg-green-100 text-green-800", icon: CheckCircle },
      PENDING_PARTNER_APPROVAL: { variant: "secondary" as const, color: "bg-orange-100 text-orange-800", icon: Clock },
      PENDING_SUPER_ADMIN_APPROVAL: { variant: "secondary" as const, color: "bg-purple-100 text-purple-800", icon: Clock },
      APPROVED: { variant: "default" as const, color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      REJECTED: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle },
      DRAFT: { variant: "outline" as const, color: "bg-gray-100 text-gray-800", icon: Clock },
      CANCELLED: { variant: "outline" as const, color: "bg-gray-100 text-gray-800", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onReject(application.applicationNumber, rejectReason);
    setRejectReason("");
    setShowRejectDialog(false);
  };

  const mockBorrowerDetails = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+251 911 234 567",
    address: "Addis Ababa, Ethiopia",
    nationalId: "ET1234567890",
    employer: "ABC Trading PLC",
    tin: "1234567890"
  };

  const mockProductDetails = [
    {
      name: "Agricultural Seeds",
      category: "Seeds",
      quantity: 50,
      unitPrice: 200,
      totalPrice: 10000
    },
    {
      name: "Fertilizer",
      category: "Fertilizer",
      quantity: 25,
      unitPrice: 1200,
      totalPrice: 30000
    }
  ];

  const mockPaymentSchedule = [
    {
      installment: 1,
      dueDate: "2025-11-07",
      principal: 3333.33,
      interest: 500,
      total: 3833.33,
      status: "PENDING" as const
    },
    {
      installment: 2,
      dueDate: "2025-12-07",
      principal: 3333.33,
      interest: 500,
      total: 3833.33,
      status: "PENDING" as const
    }
  ];

  const mockDocuments = [
    {
      id: "1",
      name: "National ID Copy",
      type: "Identity",
      uploadedAt: "2025-10-07",
      status: "VERIFIED" as const
    },
    {
      id: "2",
      name: "Income Certificate",
      type: "Financial",
      uploadedAt: "2025-10-07",
      status: "PENDING" as const
    },
    {
      id: "3",
      name: "Bank Statement",
      type: "Financial",
      uploadedAt: "2025-10-08",
      status: "VERIFIED" as const
    }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Loan Application Details - {application.applicationNumber}</span>
              {getStatusBadge(application.status)}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="borrower">Borrower Info</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Application Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Application Number</Label>
                        <p className="text-sm font-mono">{application.applicationNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Loan Type</Label>
                        <p className="text-sm">{application.loanType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Purpose</Label>
                        <p className="text-sm">{application.purpose || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Created Date</Label>
                        <p className="text-sm">{application.created}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Financial Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Requested Amount</Label>
                        <p className="text-lg font-semibold text-blue-600">
                          ETB {application.requestedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Approved Amount</Label>
                        <p className="text-lg font-semibold text-green-600">
                          {application.approvedAmount 
                            ? `ETB ${application.approvedAmount.toLocaleString()}` 
                            : "Not approved yet"
                          }
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Interest Rate</Label>
                        <p className="text-sm">{application.interestRate || "Not specified"}%</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Tenure</Label>
                        <p className="text-sm">{application.tenure} months</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Risk Score</Label>
                        <div className="flex items-center">
                          <p className="text-sm mr-2">{application.riskScore || "Not calculated"}/10</p>
                          {application.riskScore && (
                            <Badge variant={application.riskScore > 7 ? "destructive" : application.riskScore > 5 ? "secondary" : "default"}>
                              {application.riskScore > 7 ? "High Risk" : application.riskScore > 5 ? "Medium Risk" : "Low Risk"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Credit Score</p>
                      <p className="text-2xl font-bold text-blue-600">720</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Debt-to-Income</p>
                      <p className="text-2xl font-bold text-green-600">35%</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">Payment History</p>
                      <p className="text-2xl font-bold text-yellow-600">Good</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Borrower Info Tab */}
            <TabsContent value="borrower" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Borrower Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                        <p className="text-sm">{mockBorrowerDetails.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="text-sm flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {mockBorrowerDetails.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Phone</Label>
                        <p className="text-sm flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {mockBorrowerDetails.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Address</Label>
                        <p className="text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {mockBorrowerDetails.address}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">National ID</Label>
                        <p className="text-sm font-mono">{mockBorrowerDetails.nationalId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Employer</Label>
                        <p className="text-sm flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {mockBorrowerDetails.employer}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">TIN</Label>
                        <p className="text-sm font-mono">{mockBorrowerDetails.tin}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProductDetails.map((product, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                            <p className="text-sm font-medium">{product.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Category</Label>
                            <p className="text-sm">{product.category}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Quantity</Label>
                            <p className="text-sm">{product.quantity}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Unit Price</Label>
                            <p className="text-sm">ETB {product.unitPrice.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Total Price</span>
                            <span className="text-lg font-semibold text-blue-600">
                              ETB {product.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Grand Total</span>
                        <span className="text-xl font-bold text-green-600">
                          ETB {mockProductDetails.reduce((sum, product) => sum + product.totalPrice, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Document Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.type} • Uploaded {doc.uploadedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={doc.status === "VERIFIED" ? "default" : doc.status === "REJECTED" ? "destructive" : "secondary"}
                          >
                            {doc.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Payment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPaymentSchedule.map((payment) => (
                      <div key={payment.installment} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{payment.installment}</span>
                          </div>
                          <div>
                            <p className="font-medium">Installment {payment.installment}</p>
                            <p className="text-sm text-gray-600">Due: {payment.dueDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">ETB {payment.total.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            Principal: {payment.principal.toLocaleString()} | Interest: {payment.interest.toLocaleString()}
                          </p>
                        </div>
                        <Badge 
                          variant={payment.status === "PAID" ? "default" : payment.status === "OVERDUE" ? "destructive" : "secondary"}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {application.status === "PENDING_SUPER_ADMIN_APPROVAL" && (
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onApprove(application.applicationNumber)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Reason for Rejection</Label>
              <Textarea
                id="reject-reason"
                placeholder="Please provide a detailed reason for rejecting this loan application..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanDetailView;
