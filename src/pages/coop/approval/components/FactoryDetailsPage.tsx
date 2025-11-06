import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  FileText,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  Hash,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
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
import { Label } from "../../../../common/ui/label";
import { useFactories } from "../../hooks/use-factories";
import { toast } from "react-hot-toast";
import userService, { User as UserType } from "../../../../services/userService";
import documentService from "../../../../services/documentService";
import DocumentPreview from "./DocumentPreview";

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
        Factory Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested factory could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Factories
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


const FactoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [adminDetails, setAdminDetails] = useState<UserType | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [factoryDocuments, setFactoryDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // Predefined rejection reasons (same as agents/consumers)
  const rejectionReasons = [
    "The tin number doesn't match.",
    "Insufficient or invalid documentation provided for verification.",
    "Trade License not renewed",
    "Invalid ID card",
    "Other"
  ];

  const {
    factories,
    isLoading,
    approveFactory,
    rejectFactory,
    isApproving,
    isRejecting,
  } = useFactories();
  
  const factory = factories?.find((factory: any) => factory?.id?.toString() === id);

  // Fetch admin details when factory is loaded
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (factory?.adminApprovedBy) {
        setAdminLoading(true);
        try {
          const admin = await userService.getAdminById(factory.adminApprovedBy);
          setAdminDetails(admin);
        } catch (error) {
          console.error('Error fetching admin details:', error);
          setAdminDetails(null);
        } finally {
          setAdminLoading(false);
        }
      }
    };

    fetchAdminDetails();
  }, [factory?.adminApprovedBy]);

  // Fetch documents for the factory
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!factory?.id && !id) return;
      
      const factoryId = factory?.id || id;
      setDocumentsLoading(true);
      try {
        const docs = await documentService.getUserDocuments(factoryId);
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
            fileType: doc.fileType || doc.mimeType
          };
        });
        setFactoryDocuments(transformedDocs);
      } catch (error) {
        console.error("Error fetching factory documents:", error);
        toast.error("Failed to load documents");
      } finally {
        setDocumentsLoading(false);
      }
    };

    if (factory || id) {
      fetchDocuments();
    }
  }, [factory?.id, id]);

  // Handler functions
  const handleBack = () => {
    navigate("/coop/approval?tab=factories");
  };

  const onApprove = async () => {
    try {
      await approveFactory(id || "");
      setOpenApprove(false);
    } catch (error) {
      console.error("Error approving factory:", error);
      // Error message is already handled by the mutation
    }
  };

  const onReject = async () => {
    if (!factory?.id) {
      toast.error("Invalid factory ID");
      return;
    }

    // Determine the reason to send
    const finalReason = selectedRejectReason === "Other" ? customReason : selectedRejectReason;
    
    if (!finalReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    try {
      await rejectFactory({ factoryId: factory.id, reason: finalReason });
      setOpenReject(false);
      setSelectedRejectReason("");
      setCustomReason("");
    } catch (error) {
      console.error("Error rejecting factory:", error);
      // Error message is already handled by the mutation
    }
  };

  // Check document statuses
  const hasRejectedDocuments = factoryDocuments.some(
    (doc: any) => doc.superAdminStatus === "Rejected"
  );
  const allDocumentsApproved = factoryDocuments.length > 0 && factoryDocuments.every(
    (doc: any) => doc.superAdminStatus === "Approved"
  );
  const hasDocuments = factoryDocuments.length > 0;

  // Check if factory can be approved/rejected
  // 1. Partner must have approved the factory
  // 2. Factory must be pending (not already processed by super admin)
  // 3. For approval: All documents must be approved by super admin (or no documents)
  // 4. Cannot approve if any document is rejected
  const canApprove = factory?.adminStatus === "Approved" && 
                     factory?.status === "Pending" && 
                     !hasRejectedDocuments && 
                     (allDocumentsApproved || !hasDocuments);
  
  const canReject = factory?.adminStatus === "Approved" && factory?.status === "Pending";

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!factory) {
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
          loading={isApproving}
          title="Approve Factory"
          description="Are you sure you want to approve this factory?"
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
          title="Reject Factory"
          description="Please select a reason for rejecting this factory:"
          content={
            <div className="mt-4 space-y-4">
              <div className="space-y-3">
                <Label htmlFor="reject-reason">Select rejection reason:</Label>
                <div className="space-y-2">
                  {rejectionReasons.map((reason) => (
                    <label
                      key={reason}
                      htmlFor={`reject-reason-${reason}`}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={`reject-reason-${reason}`}
                        name="reject-reason"
                        value={reason}
                        checked={selectedRejectReason === reason}
                        onChange={(e) => setSelectedRejectReason(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300">{reason}</span>
                    </label>
                  ))}
                </div>
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
          Back to Factories
        </Button>

        {/* Factory Header with Details */}
        <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold dark:text-slate-100 flex items-center">
                  <Building2 className="w-6 h-6 mr-2" />
                  {factory.form.factoryName || factory.name}
                </h1>
                <p className="text-gray-600 dark:text-slate-400">
                  Factory Registration • ID: {factory.form.registrationNo || factory.id}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(factory.status || factory.approvalStatus)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoField 
                  label="Factory Type" 
                  value={factory.form.factoryType || factory.form.industry || "N/A"} 
                  icon={<Building2 className="w-4 h-4" />}
                />
                <InfoField 
                  label="TIN Number" 
                  value={factory.form.tin || "N/A"} 
                  icon={<Hash className="w-4 h-4" />}
                />
                <InfoField 
                  label="License Number" 
                  value={factory.form.licenseNumber || factory.form.registrationNo || "N/A"} 
                  icon={<FileText className="w-4 h-4" />}
                />
                <InfoField 
                  label="License Expiration Date" 
                  value={factory.form.licenseExpirationDate || "N/A"} 
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoField 
                  label="Phone" 
                  value={factory.form.phone || "N/A"} 
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>
              <div className="space-y-4">
                <InfoField 
                  label="Email" 
                  value={factory.form.email || "N/A"} 
                  icon={<Mail className="w-4 h-4" />}
                />
                <InfoField 
                  label="Industry Type" 
                  value={factory.form.factoryType || factory.form.industry || "N/A"} 
                  icon={<Building2 className="w-4 h-4" />}
                />
                <InfoField 
                  label="Production Capacity" 
                  value={factory.form.capacity || "N/A"} 
                  icon={<Building2 className="w-4 h-4" />}
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
        </div>
        
        {/* Warning messages */}
        {!canApprove && canReject && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-700 rounded-lg shadow-md">
            <div className="text-sm text-red-900 dark:text-red-100 font-semibold">
              {hasRejectedDocuments 
                ? "Cannot approve factory: One or more documents have been rejected by super admin. All documents must be approved to approve the factory."
                : hasDocuments && !allDocumentsApproved
                ? "Cannot approve factory: All documents must be approved by super admin before the factory can be approved."
                : "Cannot approve factory at this time."
              }
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
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Building2 className="w-5 h-5" />
                  <span>Factory Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoField 
                      label="Address" 
                      value={factory.form.address || factory.form.location || "N/A"} 
                      icon={<MapPin className="w-4 h-4" />}
                    />
                    {/* Bank Info Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Bank Information</h4>
                      </div>
                      
                      {factory.form.bankAccounts && factory.form.bankAccounts.length > 0 ? (
                        <div className="space-y-3">
                          {factory.form.bankAccounts.map((bank: any, index: number) => (
                            <div key={bank.id || index} className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg border border-blue-200 dark:border-slate-600">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                <div>
                                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Branch</p>
                                  <p className="text-sm text-gray-900 dark:text-slate-100">{bank.bankBranch || "N/A"}</p>
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
                              {bank.isPrimary && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
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
                    <InfoField 
                      label="Second Contact Person" 
                      value={factory.form.alternateContactPerson || "N/A"} 
                      icon={<User className="w-4 h-4" />}
                    />
                  </div>
                  <div className="space-y-4">
                    <InfoField 
                      label="Created Date" 
                      value={factory.createdAt ? new Date(factory.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "N/A"} 
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <InfoField 
                      label="Last Updated" 
                      value={factory.updatedAt ? new Date(factory.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "N/A"} 
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <InfoField 
                      label="Status" 
                      value={factory.status || factory.approvalStatus || "N/A"} 
                      icon={<CheckCircle className="w-4 h-4" />}
                    />
                    <InfoField 
                      label="Approve/Rejected By" 
                      value={
                        adminLoading ? "Loading..." : 
                        adminDetails ? 
                          `${adminDetails.name || adminDetails.firstName || ""} ${adminDetails.lastName || ""}`.trim() || 
                          `Admin ID: ${factory.adminApprovedBy}` : 
                          factory.adminApprovedBy ? `Admin ID: ${factory.adminApprovedBy}` : "N/A"
                      } 
                      icon={<User className="w-4 h-4" />}
                    />
                    <InfoField 
                      label="Approved/Rejected At" 
                      value={
                        factory.adminApprovedAt ? 
                          new Date(factory.adminApprovedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : "N/A"
                      } 
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                documents={factoryDocuments}
                title="Factory Documents"
                entityStatus={factory?.status as "Approved" | "Pending" | "Rejected" | undefined}
                entityAdminStatus={factory?.adminStatus as "Approved" | "Pending" | "Rejected" | undefined}
                onDocumentUpdate={(documentId, status) => {
                  // Update the document in local state - update superAdminStatus
                  setFactoryDocuments(prev => prev.map(doc => {
                    const docId = typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
                    const targetId = typeof documentId === 'string' ? parseInt(documentId, 10) : documentId;
                    return docId === targetId ? { ...doc, superAdminStatus: status as "Approved" | "Pending" | "Rejected" } : doc;
                  }));
                }}
              />
            )}
          </TabsContent>

        </Tabs>
      </Card>
    </div>
  );
};

export default FactoryDetailsPage;
