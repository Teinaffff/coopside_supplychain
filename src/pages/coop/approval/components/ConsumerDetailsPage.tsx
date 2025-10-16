import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  CreditCard,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import DocumentPreview from "./DocumentPreview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../common/ui/tabs";
import { Textarea } from "../../../../common/ui/textarea";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";
import API from "../../../../config/axios-config";
import { toast } from "react-hot-toast";

// Consumer interface
interface Consumer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  occupation: string;
  employer: string;
  income: number;
  bankAccount: string;
  linkedCoop: string;
  adminStatus: "Approved" | "Rejected" | "Pending";
  status: "Approved" | "Rejected" | "Pending";
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
        Back to Institution List
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

// Reusable Activity Item Component
interface ActivityItemProps {
  action: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, timestamp }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
        {action}
      </div>
      <div className="text-xs text-gray-500 dark:text-slate-400">
        {timestamp}
      </div>
    </div>
  </div>
);

const ConsumerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // Predefined rejection reasons
  const rejectionReasons = [
    "The tin number doesn't match.",
    "Insufficient or invalid documentation provided for verification.",
    "Trade License not renewed",
    "Invalid ID card",
    "Other"
  ];

  // Handler functions
  const handleBack = () => {
    // Try to get institution ID from consumer data or URL params
    const institutionId = consumer?.institutionId || 
                         (searchParams.get('institutionId') ? parseInt(searchParams.get('institutionId')!) : null);
    
    if (institutionId && institutionId > 0) {
      // Navigate back to the institution detail page with consumers tab
      navigate(`/coop/approval/institutions/${institutionId}?tab=consumers`);
    } else {
      // Fallback to approval management page
      navigate('/coop/approval');
    }
  };

  const onApprove = async () => {
    if (!id) {
      toast.error("Invalid consumer ID");
      return;
    }

    console.log("[ON APPROVE] Starting approval for consumer ID:", id);
    console.log("[ON APPROVE] Current consumer status:", consumer?.status);

    try {
      console.log("[ON APPROVE] Sending approval request to: /v1/consumers/${id}/approve");
      const response = await API.post(`/v1/consumers/${id}/approve`);
      console.log("[ON APPROVE] API Response Status:", response.status);
      console.log("[ON APPROVE] API Response Data:", JSON.stringify(response.data, null, 2));
      console.log("[ON APPROVE] API Response Headers:", response.headers);
      
      setOpenApprove(false);
      toast.success("Consumer approved successfully!");
      
      // Update consumer status locally - always set to Approved
      if (consumer) {
        setConsumer({ ...consumer, status: "Approved" });
        console.log("[ON APPROVE] Updated local consumer status to Approved");
      }
      
      // Refresh consumer data from API to get the actual updated status - increased delay for backend processing
      setTimeout(async () => {
        try {
          console.log("[ON APPROVE] Refreshing consumer data from API...");
          const refreshResponse = await API.get(`/v1/consumers/${id}`);
          const refreshedConsumerData = refreshResponse.data?.data || refreshResponse.data;
          console.log("[ON APPROVE] Refreshed consumer data:", refreshedConsumerData);
          console.log("[ON APPROVE] Full refreshed response:", JSON.stringify(refreshResponse.data, null, 2));
          
          if (refreshedConsumerData) {
            // Log all possible status fields
            console.log("[ON APPROVE] All status fields:", {
              status: refreshedConsumerData.status,
              approvalStatus: refreshedConsumerData.approvalStatus,
              adminStatus: refreshedConsumerData.adminStatus,
              superAdminStatus: refreshedConsumerData.superAdminStatus,
              bankApprovalStatus: refreshedConsumerData.bankApprovalStatus,
            });
            
            // Map the status - prioritize the most specific field
            let mappedStatus = "Pending";
            
            // Check various possible status field names
            if (refreshedConsumerData.superAdminStatus) {
              mappedStatus = refreshedConsumerData.superAdminStatus === "APPROVED" ? "Approved" :
                            refreshedConsumerData.superAdminStatus === "REJECTED" ? "Rejected" : "Pending";
            } else if (refreshedConsumerData.bankApprovalStatus) {
              mappedStatus = refreshedConsumerData.bankApprovalStatus === "APPROVED" ? "Approved" :
                            refreshedConsumerData.bankApprovalStatus === "REJECTED" ? "Rejected" : "Pending";
            } else if (refreshedConsumerData.status) {
              mappedStatus = refreshedConsumerData.status === "APPROVED" || refreshedConsumerData.status === "Approved" ? "Approved" :
                            refreshedConsumerData.status === "REJECTED" || refreshedConsumerData.status === "Rejected" ? "Rejected" : "Pending";
            }
            
            let mappedAdminStatus = "Pending";
            if (refreshedConsumerData.approvalStatus) {
              mappedAdminStatus = refreshedConsumerData.approvalStatus === "APPROVED" ? "Approved" :
                                 refreshedConsumerData.approvalStatus === "REJECTED" ? "Rejected" : "Pending";
            } else if (refreshedConsumerData.adminStatus) {
              mappedAdminStatus = refreshedConsumerData.adminStatus === "APPROVED" || refreshedConsumerData.adminStatus === "Approved" ? "Approved" :
                                 refreshedConsumerData.adminStatus === "REJECTED" || refreshedConsumerData.adminStatus === "Rejected" ? "Rejected" : "Pending";
            }
            
            const updatedConsumer = {
              ...consumer,
              status: mappedStatus,
              adminStatus: mappedAdminStatus
            };
            
            console.log("[ON APPROVE] Mapped statuses:", {
              superAdminStatus: mappedStatus,
              partnerStatus: mappedAdminStatus
            });
            console.log("[ON APPROVE] Updated consumer with refreshed data:", updatedConsumer);
            setConsumer(updatedConsumer);
          }
        } catch (refreshError) {
          console.error("[ON APPROVE] Error refreshing consumer data:", refreshError);
        }
      }, 2000);
      
    } catch (error: any) {
      console.error("Error approving consumer:", error);
      console.log("[ON APPROVE] Error response:", error?.response?.data);
      // Even if API says already approved, we should update the UI to show Approved
      if (error?.response?.data?.message?.includes("already approved")) {
        setOpenApprove(false);
        toast.success("Consumer approved successfully!");
        if (consumer) {
          setConsumer({ ...consumer, status: "Approved" });
        }
      } else {
      toast.error(error?.response?.data?.message || "Failed to approve consumer");
      }
    }
  };

  const onReject = () => {
    // Determine the reason to send
    const finalReason = selectedRejectReason === "Other" ? customReason : selectedRejectReason;

    if (!finalReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    // Get the consumer ID
    const consumerId = consumer?.id || (id ? parseInt(id, 10) : null);
    
    if (!consumerId) {
      console.error("Invalid consumer ID:", { consumerId, id, consumer });
      toast.error("Invalid consumer ID - unable to reject");
      return;
    }

    console.log("[ON REJECT] Starting rejection for consumer ID:", consumerId);
    console.log("[ON REJECT] Reason:", finalReason);
    console.log("[ON REJECT] Current consumer status:", consumer?.status);
    console.log("[ON REJECT] Sending rejection request to: /v1/consumers/${consumerId}/reject?reason=${finalReason}");

    // Call the API with reason as query parameter
    API.post(`/v1/consumers/${consumerId}/reject?reason=${encodeURIComponent(finalReason)}`)
      .then((response) => {
        console.log("[ON REJECT] API Response Status:", response.status);
        console.log("[ON REJECT] API Response Data:", JSON.stringify(response.data, null, 2));
        console.log("[ON REJECT] API Response Headers:", response.headers);
        
      setOpenReject(false);
        setSelectedRejectReason("");
        setCustomReason("");
      toast.success("Consumer rejected successfully!");
      
        // Update consumer status locally - always set to Rejected
      if (consumer) {
          setConsumer({ ...consumer, status: "Rejected" });
          console.log("[ON REJECT] Updated local consumer status to Rejected");
        }
        
        // Refresh consumer data from API to get the actual updated status - increased delay for backend processing
        setTimeout(async () => {
          try {
            console.log("[ON REJECT] Refreshing consumer data from API after 3 seconds...");
            const refreshResponse = await API.get(`/v1/consumers/${consumerId}`);
            const refreshedConsumerData = refreshResponse.data?.data || refreshResponse.data;
            console.log("[ON REJECT] Refreshed consumer data:", refreshedConsumerData);
            console.log("[ON REJECT] Full refreshed response:", JSON.stringify(refreshResponse.data, null, 2));
            
            if (refreshedConsumerData) {
              // Log all possible status fields
              console.log("[ON REJECT] All status fields from refresh:", {
                status: refreshedConsumerData.status,
                approvalStatus: refreshedConsumerData.approvalStatus,
                adminStatus: refreshedConsumerData.adminStatus,
                superAdminStatus: refreshedConsumerData.superAdminStatus,
                bankApprovalStatus: refreshedConsumerData.bankApprovalStatus,
                coopAdminStatus: refreshedConsumerData.coopAdminStatus,
                partnerStatus: refreshedConsumerData.partnerStatus,
              });
              
              // Map the status - prioritize the most specific field, default to Rejected since we just rejected
              let mappedStatus = "Rejected";
              
              // Check various possible status field names
              if (refreshedConsumerData.superAdminStatus) {
                mappedStatus = refreshedConsumerData.superAdminStatus === "APPROVED" || refreshedConsumerData.superAdminStatus === "Approved" ? "Approved" :
                              refreshedConsumerData.superAdminStatus === "REJECTED" || refreshedConsumerData.superAdminStatus === "Rejected" ? "Rejected" :
                              refreshedConsumerData.superAdminStatus === "PENDING" || refreshedConsumerData.superAdminStatus === "Pending" ? "Pending" : "Rejected";
              } else if (refreshedConsumerData.bankApprovalStatus) {
                mappedStatus = refreshedConsumerData.bankApprovalStatus === "APPROVED" || refreshedConsumerData.bankApprovalStatus === "Approved" ? "Approved" :
                              refreshedConsumerData.bankApprovalStatus === "REJECTED" || refreshedConsumerData.bankApprovalStatus === "Rejected" ? "Rejected" :
                              refreshedConsumerData.bankApprovalStatus === "PENDING" || refreshedConsumerData.bankApprovalStatus === "Pending" ? "Pending" : "Rejected";
              } else if (refreshedConsumerData.status) {
                mappedStatus = refreshedConsumerData.status === "APPROVED" || refreshedConsumerData.status === "Approved" ? "Approved" :
                              refreshedConsumerData.status === "REJECTED" || refreshedConsumerData.status === "Rejected" ? "Rejected" :
                              refreshedConsumerData.status === "PENDING" || refreshedConsumerData.status === "Pending" ? "Pending" : "Rejected";
              }
              
              let mappedAdminStatus = "Approved";
              if (refreshedConsumerData.approvalStatus) {
                mappedAdminStatus = refreshedConsumerData.approvalStatus === "APPROVED" || refreshedConsumerData.approvalStatus === "Approved" ? "Approved" :
                                   refreshedConsumerData.approvalStatus === "REJECTED" || refreshedConsumerData.approvalStatus === "Rejected" ? "Rejected" :
                                   refreshedConsumerData.approvalStatus === "PENDING" || refreshedConsumerData.approvalStatus === "Pending" ? "Pending" : "Approved";
              } else if (refreshedConsumerData.adminStatus) {
                mappedAdminStatus = refreshedConsumerData.adminStatus === "APPROVED" || refreshedConsumerData.adminStatus === "Approved" ? "Approved" :
                                   refreshedConsumerData.adminStatus === "REJECTED" || refreshedConsumerData.adminStatus === "Rejected" ? "Rejected" :
                                   refreshedConsumerData.adminStatus === "PENDING" || refreshedConsumerData.adminStatus === "Pending" ? "Pending" : "Approved";
              }
              
              const updatedConsumer = {
                ...consumer,
                status: mappedStatus,
                adminStatus: mappedAdminStatus
              };
              
              console.log("[ON REJECT] Mapped statuses after rejection:", {
                superAdminStatus: mappedStatus,
                partnerStatus: mappedAdminStatus
              });
              console.log("[ON REJECT] Updated consumer with refreshed data:", updatedConsumer);
              
              // If status is still Pending or Approved after rejection, it means the API didn't persist the change
              if (mappedStatus === "Pending" || mappedStatus === "Approved") {
                console.warn("[ON REJECT] WARNING: Status is still", mappedStatus, "after rejection! API may not be persisting the change.");
                console.warn("[ON REJECT] This could mean:");
                console.warn("[ON REJECT] 1. The API rejection endpoint doesn't actually change the status");
                console.warn("[ON REJECT] 2. The status field name is different");
                console.warn("[ON REJECT] 3. There's a backend issue preventing the update");
                
                // Force status to Rejected in the UI since the API call succeeded
                updatedConsumer.status = "Rejected";
                toast.warning("Status updated locally. If it reverts, there may be a backend issue.");
              }
              
              setConsumer(updatedConsumer);
            }
          } catch (refreshError) {
            console.error("[ON REJECT] Error refreshing consumer data:", refreshError);
            console.error("[ON REJECT] Full error:", JSON.stringify(refreshError, null, 2));
          }
        }, 3000); // Increased to 3 seconds
      })
      .catch((error: any) => {
      console.error("Error rejecting consumer:", error);
        console.log("[ON REJECT] Error response:", error?.response?.data);
        console.log("[ON REJECT] Error message:", error?.response?.data?.message);
        
        const errorMessage = error?.response?.data?.message || "";
        
        // Handle "Cannot reject an approved consumer" error
        if (errorMessage.toLowerCase().includes("cannot reject an approved consumer") || 
            errorMessage.toLowerCase().includes("already approved")) {
          toast.error("Backend Error: Cannot reject an approved consumer. The backend API does not allow changing from Approved to Rejected status.");
          console.warn("[ON REJECT] Backend validation prevents rejecting approved consumers");
          console.warn("[ON REJECT] You may need to:");
          console.warn("[ON REJECT] 1. Contact backend team to allow status changes");
          console.warn("[ON REJECT] 2. Or use a different workflow (unapprove first, then reject)");
          setOpenReject(false);
          setSelectedRejectReason("");
          setCustomReason("");
        }
        // Handle "already rejected" case
        else if (errorMessage.toLowerCase().includes("already rejected")) {
          setOpenReject(false);
          setSelectedRejectReason("");
          setCustomReason("");
          toast.success("Consumer rejected successfully!");
          if (consumer) {
            setConsumer({ ...consumer, status: "Rejected" });
          }
        } 
        // Handle other errors
        else {
          toast.error(errorMessage || "Failed to reject consumer");
          setOpenReject(false);
          setSelectedRejectReason("");
          setCustomReason("");
        }
      });
  };

  // Fetch consumer and institution data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch consumer details
        const consumerResponse = await API.get(`/v1/consumers/${id}`);
        const consumerData = consumerResponse.data?.data || consumerResponse.data;
        
        
        if (consumerData) {
          // Transform consumer data
          const transformedConsumer: Consumer = {
            id: consumerData.id,
            fullName: consumerData.fullLegalName || consumerData.fullName || consumerData.name || `Consumer ${consumerData.id}`,
            email: consumerData.email || "",
            phoneNumber: consumerData.phoneNumber || consumerData.phone || "",
            nationalId: consumerData.nationalId || consumerData.idNumber || "",
            gender: consumerData.gender || "",
            dateOfBirth: consumerData.dateOfBirth || consumerData.dob || "",
            maritalStatus: consumerData.maritalStatus || "",
            address: {
              street: consumerData.address?.street || consumerData.address || "",
              city: consumerData.address?.city || "",
              state: consumerData.address?.state || "",
              postalCode: consumerData.address?.postalCode || "",
              country: consumerData.address?.country || "",
            },
            occupation: consumerData.occupation || "",
            employer: consumerData.employer || "",
            income: consumerData.income || 0,
            bankAccount: consumerData.bankAccount || "",
            linkedCoop: consumerData.linkedCoop || "",
            adminStatus: consumerData.approvalStatus === "APPROVED" ? "Approved" :
                        consumerData.approvalStatus === "REJECTED" ? "Rejected" : "Pending",
            status: consumerData.status === "APPROVED" ? "Approved" :
                    consumerData.status === "REJECTED" ? "Rejected" : "Pending",
            createdAt: consumerData.createdAt || new Date().toISOString(),
            institutionId: consumerData.institutionId || 
                          consumerData.institution_id || 
                          consumerData.organizationId || 
                          consumerData.organization_id || 
                          (consumerData.institution && consumerData.institution.id) ||
                          (consumerData.organization && consumerData.organization.id) ||
                          0,
          };
          
          setConsumer(transformedConsumer);

          // Fetch institution details if institutionId exists
          if (transformedConsumer.institutionId) {
            try {
              const institutionResponse = await API.get(`/v1/institutions/${transformedConsumer.institutionId}`);
              const institutionData = institutionResponse.data?.data || institutionResponse.data;
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

  // Mock data for demonstration
  const recentActivities = [
    { action: "Consumer profile updated", timestamp: "2 hours ago" },
    { action: "Bank account verified", timestamp: "1 day ago" },
    { action: "Consumer registered", timestamp: "5 days ago" },
  ];

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  // Check if consumer can be approved/rejected (only if partner has approved)
  const canApproveOrReject = consumer?.adminStatus === "Approved";
  
  // Show different button states based on current super admin status
  // The workflow is:
  // 1. Partner approves (adminStatus = "Approved")
  // 2. Super admin can then approve OR reject (status changes from "Pending" to "Approved" or "Rejected")
  // 3. Once super admin approves, cannot reject (backend validation)
  // 4. Once super admin rejects, can only approve to change decision
  const isCurrentlyApproved = consumer?.status === "Approved";
  const isCurrentlyRejected = consumer?.status === "Rejected";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
        {/* Approve Modal */}
        <AlertModal
          isOpen={openApprove}
          onClose={() => setOpenApprove(false)}
          onConfirm={onApprove}
          loading={false}
          title="Approve Consumer"
          description="Are you sure you want to approve this consumer?"
          variant="success"
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
          loading={false}
          title="Reject Consumer"
          description="Please select a reason for rejecting this consumer:"
          content={
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="reject-reason">Reason for Rejection</Label>
                <Select value={selectedRejectReason} onValueChange={setSelectedRejectReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
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
                  <Label htmlFor="custom-reason">Custom Reason</Label>
              <Textarea
                    id="custom-reason"
                    placeholder="Please specify the reason..."
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

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Institution Detail
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
                  Consumer • ID: {consumer.nationalId || consumer.id}
                </p>
                {institution && (
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Institution: {institution.fullLegalName || institution.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Partner Status: {consumer.adminStatus}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-slate-400">Super Admin Status:</span>
                {getStatusBadge(consumer.status)}
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
                  label="Gender" 
                  value={consumer.gender || "N/A"} 
                />
                <InfoField 
                  label="Date of Birth" 
                  value={consumer.dateOfBirth ? new Date(consumer.dateOfBirth).toLocaleDateString() : "N/A"} 
                  icon={<Calendar className="w-4 h-4" />}
                />
              </div>
              <div className="space-y-4">
                <InfoField 
                  label="Marital Status" 
                  value={consumer.maritalStatus || "N/A"} 
                />
                <InfoField 
                  label="Occupation" 
                  value={consumer.occupation || "N/A"} 
                />
                <InfoField 
                  label="Employer" 
                  value={consumer.employer || "N/A"} 
                />
                <InfoField 
                  label="Income" 
                  value={consumer.income ? `$${consumer.income.toLocaleString()}` : "N/A"} 
                  icon={<CreditCard className="w-4 h-4" />}
                />
                <InfoField 
                  label="Address" 
                  value={
                    <div>
                      <div>{consumer.address.street}</div>
                      <div>{consumer.address.city}, {consumer.address.state} {consumer.address.postalCode}</div>
                      <div>{consumer.address.country}</div>
                    </div>
                  } 
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status Indicator Card */}
        {canApproveOrReject && (
          <Card className="mb-6 border-2" style={{
            borderColor: isCurrentlyApproved ? '#10b981' : isCurrentlyRejected ? '#ef4444' : '#f59e0b',
            backgroundColor: isCurrentlyApproved ? '#f0fdf4' : isCurrentlyRejected ? '#fef2f2' : '#fffbeb'
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isCurrentlyApproved && <CheckCircle className="w-6 h-6 text-green-600" />}
                  {isCurrentlyRejected && <XCircle className="w-6 h-6 text-red-600" />}
                  {!isCurrentlyApproved && !isCurrentlyRejected && <Clock className="w-6 h-6 text-yellow-600" />}
                  <div>
                    <h3 className="font-semibold text-lg" style={{
                      color: isCurrentlyApproved ? '#059669' : isCurrentlyRejected ? '#dc2626' : '#d97706'
                    }}>
                      Current Super Admin Status: {consumer?.status}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Partner Status: {consumer?.adminStatus} • You can change the super admin status below
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(consumer?.status || "Pending")}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Show if partner has approved */}
        {canApproveOrReject && (
        <div className="flex justify-end space-x-4 mb-6">
            {/* Reject button - only hide if super admin already approved (backend doesn't allow rejecting after super admin approval) */}
            {!isCurrentlyApproved && (
          <Button
            variant="destructive"
            onClick={() => setOpenReject(true)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
            )}
            {/* Approve button - only hide if super admin already rejected */}
            {!isCurrentlyRejected && (
          <Button
            onClick={() => setOpenApprove(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
            )}
          </div>
        )}
        
        {/* Info message when consumer is already approved by super admin */}
        {canApproveOrReject && isCurrentlyApproved && (
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-700 rounded-lg shadow-md">
            <p className="text-blue-900 dark:text-blue-100 text-sm font-semibold flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              This consumer has been approved by the super admin. The backend does not allow rejecting after approval.
            </p>
          </div>
        )}
        
        {/* Info message when consumer is already rejected by super admin */}
        {canApproveOrReject && isCurrentlyRejected && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-700 rounded-lg shadow-md">
            <p className="text-red-900 dark:text-red-100 text-sm font-semibold flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              This consumer has been rejected by the super admin. You can only approve if you want to change the decision.
            </p>
          </div>
        )}

        {/* Status Message if cannot approve/reject */}
        {!canApproveOrReject && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/40 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg shadow-md">
            <p className="text-yellow-900 dark:text-yellow-100 text-sm font-semibold">
              This consumer must be approved by the partner before it can be approved or rejected by the super admin.
            </p>
        </div>
        )}

        {/* Tabbed Sections */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 dark:bg-slate-700 mb-5">
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
            <TabsTrigger
              value="activity"
              className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <User className="w-5 h-5" />
                  <span>Consumer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoField label="Bank Account" value={consumer.bankAccount || "N/A"} />
                    <InfoField label="Linked Cooperative" value={consumer.linkedCoop || "N/A"} />
                  </div>
                  <div className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentPreview 
              documents={consumer?.docs && consumer.docs.length > 0 ? consumer.docs.map((doc: any, index: number) => ({
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
                  name: 'National ID',
                  type: 'Identity Document',
                  uploadedAt: new Date().toISOString(),
                  status: 'Approved' as const,
                  url: '#',
                  size: '0.5 MB'
                },
                {
                  id: 'doc-2',
                  name: 'Income Certificate',
                  type: 'Financial Document',
                  uploadedAt: new Date(Date.now() - 86400000).toISOString(),
                  status: 'Pending' as const,
                  url: '#',
                  size: '0.3 MB'
                }
              ]}
              title="Consumer Documents"
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      action={activity.action}
                      timestamp={activity.timestamp}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ConsumerDetailsPage;
