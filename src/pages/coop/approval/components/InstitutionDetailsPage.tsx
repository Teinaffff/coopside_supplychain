import React, { useState } from "react";
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
import { useInstitutions } from "../../hooks/useInstitutions";
import { toast } from "react-hot-toast";

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
  const [rejectReason, setRejectReason] = useState("");

  const {
    institutions,
    isLoading,
    approveInstitution,
    rejectInstitution,
  } = useInstitutions();
  
  const institution = institutions?.find((institution: any) => institution?.id?.toString() === id);

  // Handler functions
  const handleBack = () => {
    navigate("/coop/approval");
  };

  const onApprove = async () => {
    try {
      await approveInstitution(parseInt(id || "0"));
      setOpenApprove(false);
      toast.success("Institution approved successfully!");
    } catch (error: any) {
      console.error("Error approving institution:", error);
      toast.error(error?.message || "Failed to approve institution");
    }
  };

  const onReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await rejectInstitution(parseInt(id || "0"), rejectReason);
      setOpenReject(false);
      setRejectReason("");
      toast.success("Institution rejected successfully!");
    } catch (error: any) {
      console.error("Error rejecting institution:", error);
      toast.error(error?.message || "Failed to reject institution");
    }
  };

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
    const badgeClass = isApproved ? "bg-green-500" : statusUpper === "REJECTED" ? "bg-red-500" : "bg-yellow-500";
    
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
            setRejectReason("");
          }}
          onConfirm={onReject}
          loading={false}
          title="Reject Institution"
          description="Please provide a reason for rejecting this institution:"
          content={
            <div className="mt-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full"
                rows={3}
              />
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
          {institution.adminStatus !== "Approved" && (
            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mr-4">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Waiting for Admin approval from external portal
            </div>
          )}
          <Button
            variant="destructive"
            onClick={() => setOpenReject(true)}
            disabled={institution.status === "REJECTED" || institution.onboardingStatus === "REJECTED" || institution.adminStatus !== "Approved"}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => setOpenApprove(true)}
            disabled={institution.status === "APPROVED" || institution.onboardingStatus === "APPROVED" || institution.adminStatus !== "Approved"}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>

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
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {institution.docs && institution.docs.length > 0 ? (
                    institution.docs.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{doc.name || `Document ${index + 1}`}</div>
                            <div className="text-xs text-gray-500">{doc.uploadedAt || "Uploaded recently"}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                      No documents uploaded yet
                    </div>
                  )}
                </div>
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
