import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  CreditCard,
  FileText,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Search,
  RefreshCw,
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
import { useInstitutions } from "../../hooks/useInstitutions";
import { toast } from "react-hot-toast";
import API from "../../../../config/axios-config";

// Consumer interface
interface Consumer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  nationalId: string;
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
        Institution Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested institution could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Institutions
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

const InstitutionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  
  // Consumer state
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [consumersLoading, setConsumersLoading] = useState(false);
  const [consumersError, setConsumersError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const {
    institutions,
    isLoading,
    approveInstitution,
    rejectInstitution,
    isApproving,
    isRejecting,
  } = useInstitutions();
  
  // Parse the ID from URL params
  const numId = id ? parseInt(id, 10) : null;
  console.log("[INSTITUTION DETAILS] URL ID:", id, "Parsed as number:", numId);
  
  // Find the institution by matching both string and number IDs
  const institution = institutions?.find((institution: any) => {
    const institutionNumId = typeof institution?.id === 'number' ? institution.id : parseInt(institution?.id, 10);
    console.log("[INSTITUTION DETAILS] Comparing:", { institutionId: institutionNumId, urlId: numId });
    return institutionNumId === numId;
  });
  
  // Debug logging
  console.log("[INSTITUTION DETAILS] All institutions:", institutions);
  console.log("[INSTITUTION DETAILS] URL ID from params:", id, "Type:", typeof id);
  console.log("[INSTITUTION DETAILS] Parsed numeric ID:", numId);
  console.log("[INSTITUTION DETAILS] Available institutions with IDs:", institutions?.map(i => ({ id: i.id, numericId: parseInt(i?.id, 10), name: i.name })));
  console.log("[INSTITUTION DETAILS] Found institution:", institution);
  console.log("[INSTITUTION DETAILS] Institution ID from data:", institution?.id, "Type:", typeof institution?.id);
  console.log("[INSTITUTION DETAILS] Is loading:", isLoading);

  // Fetch consumers for this institution
  const fetchConsumers = async () => {
    if (!id) return;
    
    console.log("[FETCH CONSUMERS] Refreshing consumer list for institution:", id);
    
    try {
      setConsumersLoading(true);
      setConsumersError(null);
      
      const response = await API.get(`/v1/consumers/institution/${id}`);
      const consumersData = response.data?.data || response.data || [];
      
      console.log("[FETCH CONSUMERS] Raw API response:", consumersData);
      
      // Transform consumers data
      const transformedConsumers = consumersData.map((consumer: any) => {
        console.log("[FETCH CONSUMERS] Raw consumer data:", consumer);
        console.log("[FETCH CONSUMERS] All possible status fields:", {
          id: consumer.id,
          approvalStatus: consumer.approvalStatus,
          status: consumer.status,
          adminStatus: consumer.adminStatus,
          partnerStatus: consumer.partnerStatus,
          coopAdminStatus: consumer.coopAdminStatus,
          superAdminStatus: consumer.superAdminStatus,
          bankApprovalStatus: consumer.bankApprovalStatus,
        });
        
        // Map partner status (adminStatus) - check multiple possible field names
        let mappedAdminStatus: "Approved" | "Rejected" | "Pending" = "Pending";
        if (consumer.approvalStatus) {
          mappedAdminStatus = consumer.approvalStatus === "APPROVED" || consumer.approvalStatus === "Approved" ? "Approved" :
                             consumer.approvalStatus === "REJECTED" || consumer.approvalStatus === "Rejected" ? "Rejected" : "Pending";
        } else if (consumer.partnerStatus) {
          mappedAdminStatus = consumer.partnerStatus === "APPROVED" || consumer.partnerStatus === "Approved" ? "Approved" :
                             consumer.partnerStatus === "REJECTED" || consumer.partnerStatus === "Rejected" ? "Rejected" : "Pending";
        } else if (consumer.coopAdminStatus) {
          mappedAdminStatus = consumer.coopAdminStatus === "APPROVED" || consumer.coopAdminStatus === "Approved" ? "Approved" :
                             consumer.coopAdminStatus === "REJECTED" || consumer.coopAdminStatus === "Rejected" ? "Rejected" : "Pending";
        }
        
        // Map super admin status - check multiple possible field names
        let mappedStatus: "Approved" | "Rejected" | "Pending" = "Pending";
        if (consumer.superAdminStatus) {
          mappedStatus = consumer.superAdminStatus === "APPROVED" || consumer.superAdminStatus === "Approved" ? "Approved" :
                        consumer.superAdminStatus === "REJECTED" || consumer.superAdminStatus === "Rejected" ? "Rejected" : "Pending";
        } else if (consumer.bankApprovalStatus) {
          mappedStatus = consumer.bankApprovalStatus === "APPROVED" || consumer.bankApprovalStatus === "Approved" ? "Approved" :
                        consumer.bankApprovalStatus === "REJECTED" || consumer.bankApprovalStatus === "Rejected" ? "Rejected" : "Pending";
        } else if (consumer.status) {
          mappedStatus = consumer.status === "APPROVED" || consumer.status === "Approved" ? "Approved" :
                        consumer.status === "REJECTED" || consumer.status === "Rejected" ? "Rejected" : "Pending";
        }
        
        console.log("[FETCH CONSUMERS] Mapped statuses:", {
          id: consumer.id,
          partnerStatus: mappedAdminStatus,
          superAdminStatus: mappedStatus
        });
        
        return {
          id: consumer.id,
          fullName: consumer.fullLegalName || consumer.fullName || consumer.name || `Consumer ${consumer.id}`,
          email: consumer.email || "",
          phoneNumber: consumer.phoneNumber || consumer.phone || "",
          department: consumer.department || "",
          nationalId: consumer.nationalId || consumer.idNumber || "",
          adminStatus: mappedAdminStatus,
          status: mappedStatus,
          createdAt: consumer.createdAt || new Date().toISOString(),
          institutionId: parseInt(id),
        };
      });
      
      console.log("[FETCH CONSUMERS] Transformed consumers:", transformedConsumers);
      setConsumers(transformedConsumers);
    } catch (err: any) {
      console.error("Error fetching consumers:", err);
      setConsumersError(err?.response?.data?.message || err.message || "Failed to load consumers");
    } finally {
      setConsumersLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, [id]);

  // Refresh consumers when the consumers tab becomes active
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (activeTab === "consumers") {
      fetchConsumers();
    }
  }, [activeTab]);

  // Refresh consumers when component becomes visible (when navigating back from consumer detail)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && activeTab === "consumers") {
        console.log("[VISIBILITY CHANGE] Refreshing consumers due to visibility change");
        fetchConsumers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab]);

  // Force refresh when component mounts (when navigating back from consumer detail)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("[COMPONENT MOUNT] Force refreshing consumers on mount");
      fetchConsumers();
    }, 500); // Small delay to ensure component is fully loaded

    return () => clearTimeout(timer);
  }, []);


  // Handler functions
  const handleBack = () => {
    navigate("/coop/approval?tab=institutions");
  };

  const handleViewConsumer = (consumerId: number) => {
    navigate(`/coop/approval/consumers/${consumerId}?institutionId=${id}`);
  };

  // Filter consumers based on search and status
  const filteredConsumers = consumers.filter((consumer) => {
    const matchesSearch = consumer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.nationalId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || 
                         consumer.adminStatus === statusFilter || 
                         consumer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getConsumerStatusBadge = (status: string) => {
    const statusClasses = {
      Approved: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const onApprove = async () => {
    console.log("[ON APPROVE] Starting approval...");
    console.log("[ON APPROVE] Institution object:", institution);
    console.log("[ON APPROVE] Numeric ID from URL:", numId);
    
    // Use institution.id first, fallback to parsed URL ID
    let institutionId = institution?.id;
    
    // If institution ID is undefined, try using the parsed URL ID
    if (!institutionId && numId) {
      console.warn("[ON APPROVE] Institution ID is undefined, using URL ID:", numId);
      institutionId = numId;
    }
    
    if (!institutionId || isNaN(Number(institutionId))) {
      console.error("[ON APPROVE] Invalid institution ID:", { institutionId, numId, institution });
      toast.error("Invalid institution ID - unable to approve");
      return;
    }
    
    const numInstitutionId = Number(institutionId);
    console.log("[ON APPROVE] Calling approveInstitution with ID:", numInstitutionId);
    
    try {
      await approveInstitution(numInstitutionId);
      setOpenApprove(false);
      toast.success("Institution approved successfully!");
    } catch (error) {
      console.error("[ON APPROVE] Error approving institution:", error);
      toast.error("Failed to approve institution");
    }
  };

  const onReject = () => {
    // Determine the reason to send
    const finalReason = selectedRejectReason === "Other" ? customReason : selectedRejectReason;
  
    if (!finalReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
  
    // Get the institution ID (fallback to URL param)
    const institutionId = institution?.id || numId;
  
    if (!institutionId || isNaN(Number(institutionId))) {
      console.error("Invalid institution ID:", { institutionId, numId, institution });
      toast.error("Invalid institution ID - unable to reject");
      return;
    }
  
    // Call the mutation and pass an object (important!)
    rejectInstitution({
      institutionId: Number(institutionId),
      reason: finalReason
    });
  
     // Reset modal and form state
      setOpenReject(false);
     setSelectedRejectReason("");
     setCustomReason("");
  };
  

  // Check if institution can be approved/rejected (only if partner has approved)
  const canApproveOrReject = institution?.adminStatus === "Approved" && institution?.status === "Pending";

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!institution) {
    return <ErrorState onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Institution registration submitted", timestamp: "2 hours ago" },
    { action: "Documents uploaded", timestamp: "1 day ago" },
    { action: "Application created", timestamp: "5 days ago" },
  ];

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
          loading={false}
          title="Approve Institution"
          description="Are you sure you want to approve this institution?"
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
          loading={isRejecting}
          title="Reject Institution"
          description="Please select a reason for rejecting this institution:"
          content={
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reject-reason">Select rejection reason:</Label>
                <Select value={selectedRejectReason} onValueChange={setSelectedRejectReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a reason for rejection" />
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
                <div className="space-y-2">
                  <Label htmlFor="custom-reason">Please specify the reason:</Label>
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
          Back to Institutions
        </Button>

        {/* Institution Header with Details */}
        <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold dark:text-slate-100 flex items-center">
                  <Building className="w-6 h-6 mr-2" />
                  {institution.form.fullLegalName || institution.name}
                </h1>
                <p className="text-gray-600 dark:text-slate-400">
                  {institution.form.institutionType || "Institution"} • ID: {institution.id}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(institution.status || institution.onboardingStatus)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoField 
                  label="Business Sector" 
                  value={institution.form.businessSector || "N/A"} 
                />
                <InfoField 
                  label="Year of Establishment" 
                  value={institution.form.yearOfEstablishment || "N/A"} 
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoField 
                  label="TIN Number" 
                  value={institution.form.tin || "N/A"} 
                />
                <InfoField 
                  label="Contact Email" 
                  value={institution.form.contactEmail || "N/A"} 
                  icon={<Mail className="w-4 h-4" />}
                />
                <InfoField 
                  label="Contact Phone" 
                  value={institution.form.contactPhone || "N/A"} 
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>
              <div className="space-y-4">
                <InfoField 
                  label="Current Capital" 
                  value={institution.form.currentCapital ? `$${institution.form.currentCapital.toLocaleString()}` : "N/A"} 
                  icon={<CreditCard className="w-4 h-4" />}
                />
                <InfoField 
                  label="Permanent Employees" 
                  value={institution.form.permanentEmployees || "N/A"} 
                  icon={<Users className="w-4 h-4" />}
                />
                <InfoField 
                  label="Contractual Employees" 
                  value={institution.form.contractualEmployees || "N/A"} 
                  icon={<Users className="w-4 h-4" />}
                />
                <InfoField 
                  label="Total Branches" 
                  value={institution.form.totalBranches || "N/A"} 
                />
                <InfoField 
                  label="Main Office Address" 
                  value={institution.form.mainOfficeAddress || "N/A"} 
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <Button
            variant="destructive"
            onClick={() => setOpenReject(true)}
            disabled={!canApproveOrReject || isRejecting}
          >
            <XCircle className="w-4 h-4 mr-2" />
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={() => setOpenApprove(true)}
            disabled={!canApproveOrReject || isApproving}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isApproving ? "Approving..." : "Approve"}
          </Button>
        </div>
        
        {!canApproveOrReject && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/40 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg shadow-md">
            <div className="text-sm text-yellow-900 dark:text-yellow-100 font-semibold">
              {institution?.adminStatus !== "Approved" 
                ? "This institution must be approved by the partner first before it can be approved/rejected by super admin."
                : "This institution has already been processed."
              }
            </div>
          </div>
        )}

        {/* Tabbed Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 dark:bg-slate-700 mb-5">
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
              value="consumers"
              className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
            >
              Consumers
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
                  <Building className="w-5 h-5" />
                  <span>Institution Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoField label="Business License Number" value={institution.businessLicenseNumber || "N/A"} />
                    <InfoField label="VAT Registration Certificate" value={institution.vatRegistrationCertificate || "N/A"} />
                    <InfoField label="Establishment Proclamation" value={institution.establishmentProclamation || "N/A"} />
                    <InfoField label="Organizational Structure" value={institution.organizationalStructure || "N/A"} />
                  </div>
                  <div className="space-y-4">
                    <InfoField 
                      label="Total Asset Valuation" 
                      value={institution.totalAssetValuation ? `$${institution.totalAssetValuation.toLocaleString()}` : "N/A"} 
                    />
                    <InfoField 
                      label="Created Date" 
                      value={institution.createdAt ? new Date(institution.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "N/A"} 
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <InfoField 
                      label="Approved Date" 
                      value={institution.approvedAt ? new Date(institution.approvedAt).toLocaleDateString("en-US", {
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
              documents={institution.docs && institution.docs.length > 0 ? institution.docs.map((doc: any, index: number) => ({
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
                  name: 'Establishment Proclamation',
                  type: 'Legal Document',
                  uploadedAt: new Date().toISOString(),
                  status: 'Approved' as const,
                  url: '#',
                  size: '4.1 MB'
                },
                {
                  id: 'doc-2',
                  name: 'Business Registration',
                  type: 'Registration Document',
                  uploadedAt: new Date(Date.now() - 86400000).toISOString(),
                  status: 'Rejected' as const,
                  url: '#',
                  size: '2.3 MB'
                },
                {
                  id: 'doc-3',
                  name: 'Tax Certificate',
                  type: 'Tax Document',
                  uploadedAt: new Date(Date.now() - 172800000).toISOString(),
                  status: 'Approved' as const,
                  url: '#',
                  size: '1.7 MB'
                }
              ]}
              title="Institution Documents"
            />
          </TabsContent>

          {/* Consumers Tab */}
          <TabsContent value="consumers">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                    <Users className="w-5 h-5" />
                    <span>Consumers ({filteredConsumers.length})</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("[MANUAL REFRESH] User clicked refresh button");
                      fetchConsumers();
                    }}
                    disabled={consumersLoading}
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                  >
                    <RefreshCw className={`w-4 h-4 ${consumersLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh List</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="search"
                          placeholder="Search by name, email, phone, department, or national ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Consumers Table */}
                {consumersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading consumers...</p>
                    </div>
                  </div>
                ) : consumersError ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-red-600 dark:text-red-400 mb-2">Failed to load consumers</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{consumersError}</p>
                    </div>
                  </div>
                ) : filteredConsumers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Name</th>
                          <th className="px-4 py-2 text-left font-medium">Email</th>
                          <th className="px-4 py-2 text-left font-medium">Phone</th>
                          <th className="px-4 py-2 text-left font-medium">Department</th>
                          <th className="px-4 py-2 text-left font-medium">Status by Partner</th>
                          <th className="px-4 py-2 text-left font-medium">Status by Super Admin</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {filteredConsumers.map((consumer) => (
                          <tr 
                            key={consumer.id} 
                            className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                            onClick={() => handleViewConsumer(consumer.id)}
                          >
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-blue-600 dark:text-blue-400">
                              {consumer.fullName}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">{consumer.email}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{consumer.phoneNumber}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{consumer.department}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {getConsumerStatusBadge(consumer.adminStatus)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {getConsumerStatusBadge(consumer.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No consumers found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
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

export default InstitutionDetailsPage;
