import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import DocumentPreview from "./DocumentPreview";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../common/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../common/ui/tabs";
import { Textarea } from "../../../../common/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import API from "../../../../config/axios-config";
import { toast } from "react-hot-toast";
import { useConsumers } from "../../hooks/useConsumers";
import { mapConsumerStatus } from "../../../../lib/consumer-status-utils";

// Bank Information interface
interface BankInfo {
  id: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchName: string;
  swiftCode: string;
  iban: string;
  isPrimary: boolean;
}

// Consumer interface
interface Consumer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  employeeId: string;
  tin: string;
  jobTitle: string;
  department: string;
  grossSalary: number;
  netSalary: number;
  employmentType: string;
  maritalStatus: string;
  numberOfDependants: number;
  approvedBy: string;
  approvedAt: string;
  rejectedBy: string;
  rejectedAt: string;
  bankInfo: BankInfo[];
  docs?: any[]; // Documents array
  status: "Approved" | "Rejected" | "Pending"; // Super Admin Status
  adminStatus: "Approved" | "Rejected" | "Pending"; // Partner Status
  createdAt: string;
  institutionId: number;
}

// Reusable Error State Component
interface ErrorStateProps {
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
        Consumer Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested consumer could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Consumer List
      </Button>
    </div>
  </div>
);

// Reusable Info Field Component
interface InfoFieldProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  icon,
  className = "",
}) => (
  <div
    className={`flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg ${className}`}
  >
    <div className="flex items-center space-x-2">
      {icon && <span className="text-gray-500 dark:text-slate-400">{icon}</span>}
      <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
        {label}
      </span>
    </div>
    <span className="text-sm text-gray-900 dark:text-slate-100">{value}</span>
  </div>
);


const ConsumerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openRevoke, setOpenRevoke] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [selectedRevokeReason, setSelectedRevokeReason] = useState("");
  const [customRevokeReason, setCustomRevokeReason] = useState("");

  // Predefined rejection reasons (same as institutions/agents)
  const rejectionReasons = [
    "The tin number doesn't match.",
    "Insufficient or invalid documentation provided for verification.",
    "Trade License not renewed",
    "Invalid ID card",
    "Other"
  ];

  // Use the consumers hook for approve/reject functionality
  const {
    approveConsumerAsync,
    rejectConsumerAsync,
    revokeConsumerApprovalAsync,
    isApproving,
    isRejecting,
    isRevoking,
  } = useConsumers(consumer?.institutionId, false);

  // Handler functions
  const handleBack = () => {
    // Check if we came from an institution details page
    const urlParams = new URLSearchParams(window.location.search);
    const institutionId = urlParams.get('institutionId');
    
    if (institutionId) {
      // If we came from institution details, go back to the consumer list for that institution
      navigate(`/coop/approval/institutions/${institutionId}/consumers`);
    } else {
      // Otherwise, go back to the main approval page
      navigate('/coop/approval');
    }
  };

  const onApprove = async () => {
    if (!consumer?.id) {
      toast.error("Invalid consumer ID");
      return;
    }
    
    try {
      await approveConsumerAsync(consumer.id);
      setOpenApprove(false);
      
      // Update consumer status locally only if approval was successful
      if (consumer) {
        setConsumer({ ...consumer, status: "Approved" });
      }
    } catch (error: any) {
      console.error("Error approving consumer:", error);
      // Don't update local state if approval failed
      // Error message is already handled by the mutation
    }
  };

  const onReject = async () => {
    if (!consumer?.id) {
      toast.error("Invalid consumer ID");
      return;
    }

    // Determine the reason to send
    const finalReason = selectedRejectReason === "Other" ? customReason : selectedRejectReason;
    
    if (!finalReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    console.log("[FRONTEND] Attempting to reject consumer:", {
      id: consumer.id,
      adminStatus: consumer.adminStatus,
      status: consumer.status,
      reason: finalReason
    });
    
    try {
      await rejectConsumerAsync({ consumerId: consumer.id, reason: finalReason });
      setOpenReject(false);
      setSelectedRejectReason("");
      setCustomReason("");
      
      // Update consumer status locally only if rejection was successful
      if (consumer) {
        setConsumer({ ...consumer, status: "Rejected" });
      }
    } catch (error: any) {
      console.error("[FRONTEND] Error rejecting consumer:", error);
      // Don't update local state if rejection failed
      // Error message is already handled by the mutation
    }
  };

  const onRevoke = async () => {
    if (!consumer?.id) {
      toast.error("Invalid consumer ID");
      return;
    }

    // Determine the reason to send
    const finalReason = selectedRevokeReason === "Other" ? customRevokeReason : selectedRevokeReason;
    
    if (!finalReason.trim()) {
      toast.error("Please provide a reason for revoking approval");
      return;
    }
    
    console.log("[FRONTEND] Attempting to revoke consumer approval:", {
      id: consumer.id,
      adminStatus: consumer.adminStatus,
      status: consumer.status,
      reason: finalReason
    });
    
    try {
      await revokeConsumerApprovalAsync({ consumerId: consumer.id, reason: finalReason });
      setOpenRevoke(false);
      setSelectedRevokeReason("");
      setCustomRevokeReason("");
      
      // Update consumer status locally only if revocation was successful
      if (consumer) {
        setConsumer({ ...consumer, status: "Pending" });
      }
    } catch (error: any) {
      console.error("[FRONTEND] Error revoking consumer approval:", error);
      // Don't update local state if revocation failed
      // Error message is already handled by the mutation
    }
  };

  // Fetch consumer and institution data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch consumer details
        const consumerResponse = await API.get(`/v1/consumers/${id}`);
        const consumerData = consumerResponse.data?.data || consumerResponse.data;
        
        console.log("[CONSUMER DETAILS] Raw API response:", consumerData);
        console.log("[CONSUMER DETAILS] National ID fields:", {
          nationalId: consumerData?.nationalId,
          idNumber: consumerData?.idNumber,
          national_id: consumerData?.national_id,
          id_number: consumerData?.id_number,
          nationalIdNumber: consumerData?.nationalIdNumber
        });
        console.log("[CONSUMER DETAILS] Employee ID fields:", {
          employeeId: consumerData?.employeeId,
          employee_id: consumerData?.employee_id,
          empId: consumerData?.empId,
          emp_id: consumerData?.emp_id,
          employeeNumber: consumerData?.employeeNumber
        });
        console.log("[CONSUMER DETAILS] Employment Type fields:", {
          employmentType: consumerData?.employmentType,
          employeeType: consumerData?.employeeType,
          empType: consumerData?.empType,
          employee_type: consumerData?.employee_type
        });
        
        if (consumerData) {
          // Use the unified status mapping function
          const statusMapping = mapConsumerStatus(consumerData);
          
          console.log("[CONSUMER DETAILS] Status mapping:", {
            rawData: {
              approvalStatus: consumerData.approvalStatus,
              partnerStatus: consumerData.partnerStatus,
              coopAdminStatus: consumerData.coopAdminStatus,
              adminStatus: consumerData.adminStatus,
              superAdminStatus: consumerData.superAdminStatus,
              bankApprovalStatus: consumerData.bankApprovalStatus,
              status: consumerData.status
            },
            mapped: statusMapping
          });

          // Transform consumer data
          const transformedConsumer: Consumer = {
            id: consumerData.id,
            fullName: consumerData.fullLegalName || consumerData.fullName || consumerData.name || `Consumer ${consumerData.id}`,
            email: consumerData.email || "",
            phoneNumber: consumerData.phoneNumber || consumerData.phone || "",
            nationalId: consumerData.nationalId || consumerData.idNumber || consumerData.national_id || consumerData.id_number || consumerData.nationalIdNumber || "",
            employeeId: consumerData.employeeId || consumerData.employee_id || consumerData.empId || consumerData.emp_id || consumerData.employeeNumber || "",
            tin: consumerData.tin || consumerData.tinNumber || "",
            jobTitle: consumerData.jobTitle || consumerData.position || consumerData.title || "",
            department: consumerData.department || "",
            grossSalary: consumerData.grossSalary || consumerData.grossIncome || 0,
            netSalary: consumerData.netSalary || consumerData.netIncome || 0,
            employmentType: consumerData.employmentType || consumerData.employeeType || consumerData.empType || consumerData.employee_type || "",
            maritalStatus: consumerData.maritalStatus || consumerData.marital_status || "",
            numberOfDependants: consumerData.numberOfDependants || consumerData.dependants || consumerData.number_of_dependants || 0,
            approvedBy: consumerData.approvedBy || consumerData.approved_by || "",
            approvedAt: consumerData.approvedAt || consumerData.approved_at || "",
            rejectedBy: consumerData.rejectedBy || consumerData.rejected_by || "",
            rejectedAt: consumerData.rejectedAt || consumerData.rejected_at || "",
            bankInfo: consumerData.bankInfo || consumerData.bank_info || consumerData.bankAccounts || [],
            docs: consumerData.docs || consumerData.documents || consumerData.files || [],
            status: statusMapping.status,
            adminStatus: statusMapping.adminStatus,
            createdAt: consumerData.createdAt || new Date().toISOString(),
            institutionId: consumerData.institutionId || 0,
          };
          
          setConsumer(transformedConsumer);

          // Fetch institution details if institutionId exists
          if (transformedConsumer.institutionId) {
            try {
              const institutionResponse = await API.get(`/v1/institutions/${transformedConsumer.institutionId}`);
              const institutionData = institutionResponse.data?.data || institutionResponse.data;
              
              console.log("[CONSUMER DETAILS] Institution data:", institutionData);
              console.log("[CONSUMER DETAILS] Institution status fields:", {
                status: institutionData?.status,
                adminStatus: institutionData?.adminStatus,
                onboardingStatus: institutionData?.onboardingStatus,
                approvalStatus: institutionData?.approvalStatus,
                superAdminStatus: institutionData?.superAdminStatus
              });
              
              setInstitution(institutionData);
            } catch (err) {
              console.warn("Could not fetch institution details:", err);
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching consumer data:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load consumer data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error || !consumer) {
    return <ErrorState onBack={handleBack} />;
  }


  // Check institution status - handle different possible field names and values
  const institutionStatus = institution?.status || institution?.onboardingStatus || institution?.approvalStatus || institution?.superAdminStatus;
  const institutionAdminStatus = institution?.adminStatus || institution?.partnerStatus;
  
  console.log("[CONSUMER DETAILS] Institution status check:", {
    institutionStatus,
    institutionAdminStatus,
    institution: institution,
    allStatusFields: {
      status: institution?.status,
      onboardingStatus: institution?.onboardingStatus,
      approvalStatus: institution?.approvalStatus,
      superAdminStatus: institution?.superAdminStatus,
      adminStatus: institution?.adminStatus,
      partnerStatus: institution?.partnerStatus
    }
  });
  
  // More robust status checking - check for various forms of "Approved"
  const isInstitutionRejected = institutionStatus === "Rejected" || institutionStatus === "REJECTED";
  const isInstitutionPending = (institutionStatus === "Pending" || institutionStatus === "PENDING") && institutionAdminStatus !== "Approved" && institutionAdminStatus !== "APPROVED";
  
  // Check if institution is approved by super admin
  let isInstitutionApprovedBySuperAdmin = institutionStatus === "Approved" || institutionStatus === "APPROVED" || institutionStatus === "approved";
  
  // Fallback: If we can't determine institution status but consumer has been processed by super admin,
  // assume institution is approved (since consumer processing requires institution approval)
  if (!isInstitutionApprovedBySuperAdmin && !isInstitutionRejected && !isInstitutionPending && consumer?.status && consumer.status !== "Pending") {
    console.log("[CONSUMER DETAILS] Fallback: Assuming institution is approved because consumer has been processed by super admin");
    isInstitutionApprovedBySuperAdmin = true;
  }

  // Check if consumer can be approved/rejected
  // Can approve: if institution is approved by super admin AND partner approved consumer AND super admin hasn't processed yet
  // Can reject: if institution is approved by super admin AND partner approved consumer AND (super admin hasn't processed yet OR already approved)
  const canApprove = isInstitutionApprovedBySuperAdmin && consumer?.adminStatus === "Approved" && consumer?.status === "Pending";
  const canReject = isInstitutionApprovedBySuperAdmin && ((consumer?.adminStatus === "Approved" && consumer?.status === "Pending") || 
                   (consumer?.adminStatus === "Approved" && consumer?.status === "Approved"));

  console.log("[CONSUMER DETAILS] Action permissions:", {
    canApprove,
    canReject,
    isInstitutionApprovedBySuperAdmin,
    consumerAdminStatus: consumer?.adminStatus,
    consumerStatus: consumer?.status,
    isInstitutionRejected,
    isInstitutionPending
  });

  const getStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase();
    const isApproved = statusUpper === "APPROVED";
    const badgeLabel = isApproved ? "Approved" : statusUpper === "REJECTED" ? "Rejected" : "Pending";
    const badgeClass = isApproved ? "bg-cyan-500" : statusUpper === "REJECTED" ? "bg-red-500 text-white" : "bg-yellow-500";
    
    return (
      <Badge variant={isApproved ? "default" : "secondary"} className={badgeClass}>
        {badgeLabel}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
        {/* Approve Modal */}
        <AlertModal
          isOpen={openApprove}
          onClose={() => setOpenApprove(false)}
          onConfirm={onApprove}
          loading={isApproving}
          title="Approve Consumer"
          description="Are you sure you want to approve this consumer?"
        />

        {/* Reject Modal */}
        <AlertModal
          isOpen={openReject}
          onClose={() => {
            setOpenReject(false);
            setSelectedRejectReason("");
            setCustomReason("");
          }}
          onConfirm={onReject}
          loading={isRejecting}
          title="Reject Consumer"
          description="Please provide a reason for rejecting this consumer:"
          content={
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Select a reason:
                </label>
                <Select value={selectedRejectReason} onValueChange={setSelectedRejectReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a rejection reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedRejectReason === "Other" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Custom reason:
                  </label>
              <Textarea
                    placeholder="Enter custom rejection reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                className="w-full"
                rows={3}
              />
                </div>
              )}
            </div>
          }
        />

        {/* Revoke Modal */}
        <AlertModal
          isOpen={openRevoke}
          onClose={() => {
            setOpenRevoke(false);
            setSelectedRevokeReason("");
            setCustomRevokeReason("");
          }}
          onConfirm={onRevoke}
          loading={isRevoking}
          title="Revoke Consumer Approval"
          description="Please provide a reason for revoking this consumer's approval:"
          content={
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Select a reason:
                </label>
                <Select value={selectedRevokeReason} onValueChange={setSelectedRevokeReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a revocation reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedRevokeReason === "Other" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Custom reason:
                  </label>
              <Textarea
                    placeholder="Enter custom revocation reason..."
                    value={customRevokeReason}
                    onChange={(e) => setCustomRevokeReason(e.target.value)}
                className="w-full"
                rows={3}
              />
                </div>
              )}
            </div>
          }
        />

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Consumer List
        </Button>

        {/* Consumer Header with Details */}
        <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold dark:text-slate-100 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  {consumer.fullName}
                </h1>
                <p className="text-gray-600 dark:text-slate-400">
                  Employee ID: {consumer.employeeId || "N/A"}
                </p>
                {institution && (
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    <p>Institution: {institution.fullLegalName || institution.name}</p>
                    <p>Institution Status: {institutionStatus || "Unknown"} (Admin: {institutionAdminStatus || "Unknown"})</p>
                    <p>Detected: Approved={isInstitutionApprovedBySuperAdmin ? "Yes" : "No"}, Rejected={isInstitutionRejected ? "Yes" : "No"}, Pending={isInstitutionPending ? "Yes" : "No"}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Super Admin Status</div>
                {getStatusBadge(consumer.status)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoField 
                  label="Email" 
                  value={consumer.email || "N/A"} 
                  icon={<Mail className="w-4 h-4" />}
                />
                <InfoField 
                  label="Phone" 
                  value={consumer.phoneNumber || "N/A"} 
                  icon={<Phone className="w-4 h-4" />}
                />
                <InfoField 
                  label="National ID" 
                  value={consumer.nationalId || "N/A"} 
                />
                <InfoField 
                  label="TIN" 
                  value={consumer.tin || "N/A"} 
                />
                <InfoField 
                  label="Job Title" 
                  value={consumer.jobTitle || "N/A"} 
                />
              </div>
              <div className="space-y-4">
                <InfoField 
                  label="Department" 
                  value={consumer.department || "N/A"} 
                />
                <InfoField 
                  label="Gross Salary" 
                  value={consumer.grossSalary ? `$${consumer.grossSalary.toLocaleString()}` : "N/A"} 
                  icon={<CreditCard className="w-4 h-4" />}
                />
                <InfoField 
                  label="Net Salary" 
                  value={consumer.netSalary ? `$${consumer.netSalary.toLocaleString()}` : "N/A"} 
                  icon={<CreditCard className="w-4 h-4" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          {/* Revoke button for consumers of rejected institutions */}
          {isInstitutionRejected && consumer?.status === "Approved" && (
            <Button
              variant="destructive"
              onClick={() => setOpenRevoke(true)}
              disabled={isRevoking}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {isRevoking ? "Revoking..." : "Revoke Approval"}
            </Button>
          )}
          
          {/* Regular approve/reject buttons for approved institutions */}
          {isInstitutionApprovedBySuperAdmin && (
            <>
          <Button
            variant="destructive"
            onClick={() => setOpenReject(true)}
                disabled={!canReject || isRejecting}
          >
            <XCircle className="w-4 h-4 mr-2" />
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={() => setOpenApprove(true)}
                disabled={!canApprove || isApproving}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isApproving ? "Approving..." : "Approve"}
          </Button>
            </>
          )}
        </div>
        
        {(!canApprove && !canReject) && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/40 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg shadow-md">
            <div className="text-sm text-yellow-900 dark:text-yellow-100 font-semibold">
              {isInstitutionRejected 
                ? "This institution has been rejected by super admin. Consumer actions are disabled."
                : isInstitutionPending
                ? "This institution is pending partner approval. Consumer actions are disabled until the institution is approved."
                : !isInstitutionApprovedBySuperAdmin
                ? "This institution must be approved by super admin first before consumer actions can be performed."
                : consumer?.adminStatus !== "Approved" 
                ? "This consumer must be approved by the partner first before it can be approved/rejected by super admin."
                : "This consumer has already been processed and cannot be modified."}
            </div>
          </div>
        )}

        {/* Tabbed Sections */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-slate-700 mb-5">
            <TabsTrigger
              value="details"
              className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              
              <CardContent>
                <div className="space-y-6">
                  {/* Employee Information */}
                  <div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField 
                        label="Employment Type" 
                        value={consumer.employmentType || "N/A"} 
                      />
                      <InfoField 
                        label="Marital Status" 
                        value={consumer.maritalStatus || "N/A"} 
                      />
                      <InfoField 
                        label="Number of Dependants" 
                        value={consumer.numberOfDependants?.toString() || "N/A"} 
                      />
                    <InfoField 
                      label="Created Date" 
                      value={consumer.createdAt ? new Date(consumer.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "N/A"} 
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    </div>
                  </div>

                  {/* Approval Information */}
                  <div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField 
                        label="Super Admin Status" 
                        value={consumer.status} 
                      />
                      <InfoField 
                        label="Approved/Rejected By" 
                        value={consumer.approvedBy || consumer.rejectedBy || "N/A"} 
                      />
                      <InfoField 
                        label="Approved/Rejected At" 
                        value={consumer.approvedAt ? new Date(consumer.approvedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : consumer.rejectedAt ? new Date(consumer.rejectedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : "N/A"} 
                        icon={<Calendar className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  {/* Bank Information */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Bank Information</h3>
                    </div>
                    {consumer.bankInfo && consumer.bankInfo.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {consumer.bankInfo.map((bank, index) => (
                          <div key={bank.id || index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                                  <p className="text-gray-900 dark:text-slate-100 font-medium">{bank.bankName || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                                  <p className="text-gray-900 dark:text-slate-100">{bank.accountNumber || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                                  <p className="text-gray-900 dark:text-slate-100">{bank.accountName || "N/A"}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</label>
                                  <p className="text-gray-900 dark:text-slate-100">{bank.branchName || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Swift Code</label>
                                  <p className="text-gray-900 dark:text-slate-100">{bank.swiftCode || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">IBAN</label>
                                  <p className="text-gray-900 dark:text-slate-100">{bank.iban || "N/A"}</p>
                                </div>
                              </div>
                            </div>
                            {bank.isPrimary && (
                              <div className="mt-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                                  Primary Account
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                        <p>No bank information available</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentPreview 
              documents={consumer.docs && consumer.docs.length > 0 ? consumer.docs.map((doc: any, index: number) => ({
                id: doc.id || `doc-${index}`,
                name: doc.name || `Document ${index + 1}`,
                type: doc.type || 'Document',
                uploadedAt: doc.uploadedAt || new Date().toISOString(),
                status: doc.status || 'Pending',
                url: doc.url,
                size: doc.size
              })) : [
                // Sample documents for demonstration
                {
                  id: 'doc-1',
                  name: 'Consumer ID Document',
                  type: 'Identity Document',
                  uploadedAt: new Date().toISOString(),
                  status: 'Approved' as const,
                  url: '#',
                  size: '1.2 MB'
                },
                {
                  id: 'doc-2',
                  name: 'Employment Certificate',
                  type: 'Employment Document',
                  uploadedAt: new Date(Date.now() - 86400000).toISOString(),
                  status: 'Pending' as const,
                  url: '#',
                  size: '0.8 MB'
                }
              ]}
              title="Consumer Documents"
            />
          </TabsContent>

        </Tabs>
      </Card>
    </div>
  );
};

export default ConsumerDetailsPage;
