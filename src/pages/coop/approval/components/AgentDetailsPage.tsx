import React, { useState } from "react";
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
  ShoppingCart,
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
import { useAgents } from "../../hooks/use-Agents";
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
        Agent Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested agent could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Agents
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

const AgentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const {
    agents,
    isLoading,
    approveAgent,
    rejectAgent,
    refetch,
    isApproving,
  } = useAgents();
  
  const agent = agents?.find((agent: any) => agent?.id?.toString() === id);

  // Handler functions
  const handleBack = () => {
    navigate("/coop/approval");
  };

  const onApprove = async () => {
    try {
      await approveAgent(parseInt(id || "0"));
      setOpenApprove(false);
      toast.success("Agent approved successfully!");
    } catch (error) {
      console.error("Error approving agent:", error);
      toast.error("Failed to approve agent");
    }
  };

  const onReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await rejectAgent(parseInt(id || "0"), rejectReason);
      setOpenReject(false);
      setRejectReason("");
      toast.success("Agent rejected successfully!");
    } catch (error) {
      console.error("Error rejecting agent:", error);
      toast.error("Failed to reject agent");
    }
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!agent) {
    return <ErrorState onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Agent registration submitted", timestamp: "2 hours ago" },
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
          title="Approve Agent"
          description="Are you sure you want to approve this agent?"
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
          title="Reject Agent"
          description="Please provide a reason for rejecting this agent:"
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
          Back to Agents
        </Button>

        {/* Agent Header with Details */}
        <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold dark:text-slate-100 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  {agent.form.fullName || agent.form.fullLegalName || agent.name}
                </h1>
                <p className="text-gray-600 dark:text-slate-400">
                  {agent.form.agentType || "Agent"} • ID: {agent.form.agentId || agent.id}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(agent.status || agent.adminApprovalStatus)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoField 
                  label="Email" 
                  value={agent.form.email || "N/A"} 
                  icon={<Mail className="w-4 h-4" />}
                />
                <InfoField 
                  label="Phone" 
                  value={agent.form.phone || agent.form.phoneNumber || "N/A"} 
                  icon={<Phone className="w-4 h-4" />}
                />
                <InfoField 
                  label="National ID" 
                  value={agent.form.nationalId || agent.form.idNumber || "N/A"} 
                />
                <InfoField 
                  label="TIN Number" 
                  value={agent.form.tin || "N/A"} 
                />
                <InfoField 
                  label="License Number" 
                  value={agent.form.licenseNo || agent.form.businessLicenseNumber || "N/A"} 
                />
              </div>
              <div className="space-y-4">
                <InfoField 
                  label="Goods Type" 
                  value={agent.form.goodsType || agent.form.typeOfGoodsSold || "N/A"} 
                  icon={<ShoppingCart className="w-4 h-4" />}
                />
                <InfoField 
                  label="Linked Organization" 
                  value={agent.form.linkedOrg || agent.form.linkedCoop || "N/A"} 
                />
                <InfoField 
                  label="Commission Rate" 
                  value={agent.form.commissionRate ? `${agent.form.commissionRate}%` : "N/A"} 
                />
                <InfoField 
                  label="Address" 
                  value={agent.form.address ? 
                    `${agent.form.address.street || ''} ${agent.form.address.city || ''} ${agent.form.address.state || ''} ${agent.form.address.postalCode || ''} ${agent.form.address.country || ''}`.trim() || "N/A" 
                    : "N/A"} 
                  icon={<MapPin className="w-4 h-4" />}
                />
                <InfoField 
                  label="Created Date" 
                  value={agent.createdAt ? new Date(agent.createdAt).toLocaleDateString("en-US", {
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <Button
            variant="destructive"
            onClick={() => setOpenReject(true)}
            disabled={agent.status === "REJECTED" || agent.adminApprovalStatus === "REJECTED" || agent.adminStatus !== "Approved"}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => setOpenApprove(true)}
            disabled={agent.status === "APPROVED" || agent.adminApprovalStatus === "APPROVED" || isApproving || agent.adminStatus !== "Approved"}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isApproving ? "Approving..." : "Approve"}
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
                  <User className="w-5 h-5" />
                  <span>Agent Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoField label="Bank Account" value={agent.form.bankAccount || agent.form.bankAccountNumber || "N/A"} />
                    <InfoField label="Username" value={agent.form.username || "N/A"} />
                  </div>
                  <div className="space-y-4">
                    <InfoField 
                      label="Approved Date" 
                      value={agent.form.approvedAt ? new Date(agent.form.approvedAt).toLocaleDateString("en-US", {
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
                  {agent.docs && agent.docs.length > 0 ? (
                    agent.docs.map((doc: any, index: number) => (
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

export default AgentDetailsPage;
