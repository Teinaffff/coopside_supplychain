import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
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
  FileText,
  Eye,
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
import { ExportConsumersDataToExcel } from "./ExportConsumersDataToExcel";
import { mapConsumerStatus } from "../../../../lib/consumer-status-utils";
import documentService from "../../../../services/documentService";

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


const InstitutionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);

  // Predefined rejection reasons
  const rejectionReasons = [
    "The tin number doesn't match.",
    "Insufficient or invalid documentation provided for verification.",
    "Trade License not renewed",
    "Invalid ID card",
    "Other"
  ];

  // Mock agreements data
  const agreements = [
    {
      id: 1,
      name: "Institution Onboarding Agreement",
      status: "Pending",
      consentBy: "Partner",
      consentAt: "2024-01-15",
      documentUrl: "#",
      description: "Terms and conditions for institution onboarding process"
    },
    {
      id: 2,
      name: "Data Processing Agreement",
      status: "Approved",
      consentBy: "Partner",
      consentAt: "2024-01-10",
      documentUrl: "#",
      description: "Agreement for processing consumer data and personal information"
    },
    {
      id: 3,
      name: "Service Level Agreement",
      status: "Pending",
      consentBy: "Partner",
      consentAt: "2024-01-12",
      documentUrl: "#",
      description: "Service level commitments and performance standards"
    },
    {
      id: 4,
      name: "Financial Terms Agreement",
      status: "Rejected",
      consentBy: "Partner",
      consentAt: "2024-01-08",
      documentUrl: "#",
      description: "Financial terms, fees, and payment conditions"
    }
  ];
  
  // Consumer state
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [consumersLoading, setConsumersLoading] = useState(false);
  const [consumersError, setConsumersError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<string>("All");
  const [superAdminStatusFilter, setSuperAdminStatusFilter] = useState<string>("All");
  const [institutionDocuments, setInstitutionDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

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
  console.log("[INSTITUTION DETAILS] Available institutions with IDs:", institutions?.map(i => ({ id: i.id, numericId: typeof i.id === 'string' ? parseInt(i.id, 10) : i.id, name: i.name })));
  console.log("[INSTITUTION DETAILS] Found institution:", institution);
  console.log("[INSTITUTION DETAILS] Institution ID from data:", institution?.id, "Type:", typeof institution?.id);
  console.log("[INSTITUTION DETAILS] Is loading:", isLoading);

  // Fetch documents for the institution
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!institution?.id && !numId) return;
      
      const institutionId = institution?.id || numId;
      setDocumentsLoading(true);
      try {
        const docs = await documentService.getUserDocuments(institutionId);
        // Transform documents to match DocumentPreview format
        const transformedDocs = docs.map((doc: any) => {
          // Use relative path from API - DocumentPreview will handle authenticated fetching
          // The API returns fileUrl as a relative path like "/files/factories/19/..."
          const constructedUrl = doc.fileUrl || doc.url || '';
          // Map status: API returns status as partner status
          const partnerStatus = doc.status || 'Pending';
          // Check for superAdminStatus field (if API returns it)
          const superAdminStatus = doc.superAdminStatus || doc.superAdminApprovalStatus || undefined;
          
          // Normalize status values
          const normalizeStatus = (s: string): "Approved" | "Pending" | "Rejected" => {
            const upper = s?.toUpperCase();
            if (upper === "APPROVED") return "Approved";
            if (upper === "REJECTED") return "Rejected";
            return "Pending";
          };

          return {
            id: doc.id || doc.documentId,
            name: doc.name || doc.documentName || `Document ${doc.id}`,
            type: doc.type || doc.documentType || 'Document',
            uploadedAt: doc.uploadedAt || doc.createdAt || new Date().toISOString(),
            status: normalizeStatus(partnerStatus), // Keep for backward compatibility
            partnerStatus: normalizeStatus(partnerStatus),
            superAdminStatus: superAdminStatus ? normalizeStatus(superAdminStatus) : undefined,
            url: constructedUrl,
            size: doc.size || (doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown'),
            fileType: doc.fileType || doc.mimeType,
            documentNumber: doc.documentNumber,
            isVerified: doc.isVerified,
            reviewComments: doc.reviewComments,
            verifiedAt: doc.verifiedAt,
            approvedAt: doc.approvedAt,
            rejectedAt: doc.rejectedAt,
            approvedBy: doc.approvedBy,
            rejectedBy: doc.rejectedBy
          };
        });
        setInstitutionDocuments(transformedDocs);
      } catch (error) {
        console.error("Error fetching institution documents:", error);
        toast.error("Failed to load documents");
      } finally {
        setDocumentsLoading(false);
      }
    };

    if (institution || numId) {
      fetchDocuments();
    }
  }, [institution?.id, numId]);

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
        
        // Use the unified status mapping function
        const statusMapping = mapConsumerStatus(consumer);
        
        return {
          id: consumer.id,
          fullName: consumer.fullLegalName || consumer.fullName || consumer.name || `Consumer ${consumer.id}`,
          email: consumer.email || "N/A",
          phoneNumber: consumer.phoneNumber || consumer.phone || "N/A",
          department: consumer.department || "N/A",
          nationalId: consumer.nationalId || consumer.idNumber || consumer.national_id || consumer.id_number || consumer.nationalIdNumber || "N/A",
          adminStatus: statusMapping.adminStatus,
          status: statusMapping.status,
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
  const [activeTab, setActiveTab] = useState("details");
  
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
    
    const matchesPartnerStatus = partnerStatusFilter === "All" || 
                                consumer.adminStatus === partnerStatusFilter;
    
    const matchesSuperAdminStatus = superAdminStatusFilter === "All" || 
                                   consumer.status === superAdminStatusFilter;
    
    return matchesSearch && matchesPartnerStatus && matchesSuperAdminStatus;
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
    } catch (error) {
      console.error("[ON APPROVE] Error approving institution:", error);
      // Error message is already handled by the mutation
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
                  {institution.form.institutionType || "Institution"} • Registration: {institution.form.registrationNumber || institution.form.businessRegistrationNumber || institution.form.registrationId || "N/A"}
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
                  label="Phone" 
                  value={institution.form.phone || institution.form.contactPhone || "N/A"} 
                  icon={<Phone className="w-4 h-4" />}
                />
                <InfoField 
                  label="Email" 
                  value={institution.form.email || institution.form.contactEmail || "N/A"} 
                  icon={<Mail className="w-4 h-4" />}
                />
                <InfoField 
                  label="Year of Establishment" 
                  value={institution.form.yearOfEstablishment || "N/A"} 
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoField 
                  label="Business Sector" 
                  value={institution.form.businessSector || "N/A"} 
                />
                <InfoField 
                  label="TIN" 
                  value={institution.form.tin || "N/A"} 
                />
                <InfoField 
                  label="Current Capital" 
                  value={institution.form.currentCapital ? `$${institution.form.currentCapital.toLocaleString()}` : "N/A"} 
                  icon={<CreditCard className="w-4 h-4" />}
                />
              </div>
              <div className="space-y-4">
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
                  label="Licence Number" 
                  value={institution.form.licenceNumber || institution.form.licenseNumber || institution.form.businessLicenseNumber || "N/A"} 
                />
                <InfoField 
                  label="Licence Expiry Date" 
                  value={institution.form.licenceExpiryDate || institution.form.licenseExpiryDate || institution.form.businessLicenseExpiryDate ? 
                    new Date(institution.form.licenceExpiryDate || institution.form.licenseExpiryDate || institution.form.businessLicenseExpiryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "N/A"} 
                  icon={<Calendar className="w-4 h-4" />}
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
              value="agreements"
              className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
            >
              Agreements
            </TabsTrigger>
            <TabsTrigger
              value="consumers"
              className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
            >
              Consumers
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            {/* Bank Information and Approval Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Bank Information Column */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Bank Information</h4>
                </div>
                
                {institution.form.bankAccounts && institution.form.bankAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {institution.form.bankAccounts.map((bank: any, index: number) => (
                      <div key={bank.id || index} className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg border border-blue-200 dark:border-slate-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Bank Name</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.bankName || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Account Number</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.accountNumber || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Account Name</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.accountName || "N/A"}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Branch</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.branch || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Swift Code</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.swiftCode || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">IBAN</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.iban || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        {bank.isPrimary && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                              Primary Account
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                    <div className="text-center py-4 text-gray-500 dark:text-slate-400">
                      No bank account information available
                    </div>
                  </div>
                )}
              </div>

              {/* Created Fields Column */}
              <div className="space-y-3">
                
                
                <div className="space-y-4">
                  <InfoField 
                    label="Total Branches" 
                    value={institution.form.totalBranches || "N/A"} 
                  />
                  <InfoField 
                    label="Total Asset Valuation" 
                    value={institution.form.totalAssetValuation ? `$${institution.form.totalAssetValuation.toLocaleString()}` : "N/A"} 
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  <InfoField 
                    label="Status" 
                    value={institution.status || "N/A"} 
                    icon={<CheckCircle className="w-4 h-4" />}
                  />
                  <InfoField 
                    label="Approved/Rejected By" 
                    value={institution.form.approvedBy || institution.form.rejectedBy || "N/A"} 
                    icon={<Users className="w-4 h-4" />}
                  />
                  <InfoField 
                    label="Approved/Rejected At" 
                    value={institution.form.approvedAt || institution.form.rejectedAt ? 
                      new Date(institution.form.approvedAt || institution.form.rejectedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "N/A"} 
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoField 
                    label="Created Date" 
                    value={institution.form.createdAt ? new Date(institution.form.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "N/A"} 
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            {documentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-slate-400">Loading documents...</p>
                </div>
              </div>
            ) : (
            <DocumentPreview 
                documents={institutionDocuments}
              title="Institution Documents"
                onDocumentUpdate={(documentId, status) => {
                  // Update the document in local state
                  setInstitutionDocuments(prev => prev.map(doc => 
                    doc.id === documentId ? { ...doc, status } : doc
                  ));
                }}
              />
            )}
          </TabsContent>

          {/* Agreements Tab */}
          <TabsContent value="agreements">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agreements List */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Institution Agreements</span>
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {agreements.length}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Partner consent status for each agreement
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Individual Agreements */}
                    {agreements.map((agreement) => (
                      <div
                        key={agreement.id}
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 border transition-colors ${
                          selectedAgreement?.id === agreement.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600'
                        }`}
                        onClick={() => {
                          setSelectedAgreement(agreement);
                          // Open document in document viewer
                          window.open(agreement.documentUrl, '_blank');
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {agreement.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {agreement.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500 dark:text-slate-400">
                                  Partner Status: 
                                  <Badge 
                                    className={`ml-1 ${
                                      agreement.status === "Approved" 
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : agreement.status === "Rejected"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    }`}
                                  >
                                    {agreement.status}
                                  </Badge>
                                </span>
                                <span className="text-xs text-gray-500 dark:text-slate-400">
                                  {new Date(agreement.consentAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Document Preview */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Agreement Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAgreement ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                          {selectedAgreement.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                          {selectedAgreement.description}
                        </p>
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700 dark:text-slate-300">Partner Status:</span>
                            <Badge 
                              className={
                                selectedAgreement.status === "Approved" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : selectedAgreement.status === "Rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }
                            >
                              {selectedAgreement.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700 dark:text-slate-300">Consent Date:</span>
                            <span className="text-gray-900 dark:text-slate-100">
                              {new Date(selectedAgreement.consentAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Document Preview Area */}
                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-slate-400 font-medium">
                          Click agreement to view document
                        </p>
                        <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">
                          Document will open in a new tab
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">
                        No Agreement Selected
                      </p>
                      <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">
                        Click an agreement to view its details and open the document
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {
                        if (filteredConsumers.length > 0) {
                          ExportConsumersDataToExcel(filteredConsumers, institution?.form?.fullLegalName || institution?.name);
                        } else {
                          toast.error("No consumer data to export");
                        }
                      }}
                      disabled={consumersLoading || filteredConsumers.length === 0}
                      className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export to Excel</span>
                    </Button>
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
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Label htmlFor="partnerStatus">Status by Partner</Label>
                      <Select value={partnerStatusFilter} onValueChange={setPartnerStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select partner status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="superAdminStatus">Status by Super Admin</Label>
                      <Select value={superAdminStatusFilter} onValueChange={setSuperAdminStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select super admin status" />
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

        </Tabs>
      </Card>
    </div>
  );
};

export default InstitutionDetailsPage;
