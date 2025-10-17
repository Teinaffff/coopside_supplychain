import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  CreditCard,
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
import { useAgents } from "../../hooks/use-Agents";
import { toast } from "react-hot-toast";
import { Label } from "../../../../common/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";

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


const AgentDetailsPage: React.FC = () => {
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

  const {
    agents,
    isLoading,
    approveAgent,
    rejectAgent,
    isApproving,
    isRejecting,
  } = useAgents();
  
  // Parse the ID from URL params
  const numId = id ? parseInt(id, 10) : null;
  console.log("[AGENT DETAILS] URL ID:", id, "Parsed as number:", numId);
  
  // Find the agent by matching both string and number IDs
  const agent = agents?.find((agent: any) => {
    const agentNumId = typeof agent?.id === 'number' ? agent.id : parseInt(agent?.id, 10);
    console.log("[AGENT DETAILS] Comparing:", { agentId: agentNumId, urlId: numId });
    return agentNumId === numId;
  });
  
  // Debug logging
  console.log("[AGENT DETAILS] All agents:", agents);
  console.log("[AGENT DETAILS] URL ID from params:", id, "Type:", typeof id);
  console.log("[AGENT DETAILS] Parsed numeric ID:", numId);
  console.log("[AGENT DETAILS] Available agents with IDs:", agents?.map(a => ({ id: a.id, numericId: typeof a?.id === 'string' ? parseInt(a.id, 10) : a.id, name: a.name })));
  console.log("[AGENT DETAILS] Found agent:", agent);
  console.log("[AGENT DETAILS] Agent ID from data:", agent?.id, "Type:", typeof agent?.id);
  console.log("[AGENT DETAILS] Is loading:", isLoading);

  // Handler functions
  const handleBack = () => {
    navigate("/coop/approval?tab=agents");
  };

  const onApprove = async () => {
    console.log("[ON APPROVE] Starting approval...");
    console.log("[ON APPROVE] Agent object:", agent);
    console.log("[ON APPROVE] Numeric ID from URL:", numId);
    
    // Use agent.id first, fallback to parsed URL ID
    let agentId = agent?.id;
    
    // If agent ID is undefined, try using the parsed URL ID
    if (!agentId && numId) {
      console.warn("[ON APPROVE] Agent ID is undefined, using URL ID:", numId);
      agentId = numId;
    }
    
    if (!agentId || isNaN(Number(agentId))) {
      console.error("[ON APPROVE] Invalid agent ID:", { agentId, numId, agent });
      toast.error("Invalid agent ID - unable to approve");
      return;
    }
    
    const numAgentId = Number(agentId);
    console.log("[ON APPROVE] Calling approveAgent with ID:", numAgentId);
    
    try {
      await approveAgent(numAgentId);
      setOpenApprove(false);
    } catch (error) {
      console.error("[ON APPROVE] Error approving agent:", error);
      // Error message is already handled by the mutation
    }
  };

  const onReject = async () => {
    const finalReason = selectedRejectReason === "Other" ? customReason : selectedRejectReason;
    
    if (!finalReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    console.log("[ON REJECT] Starting rejection...");
    console.log("[ON REJECT] Agent object:", agent);
    console.log("[ON REJECT] Numeric ID from URL:", numId);
    
    // Use agent.id first, fallback to parsed URL ID
    let agentId = agent?.id;
    
    // If agent ID is undefined, try using the parsed URL ID
    if (!agentId && numId) {
      console.warn("[ON REJECT] Agent ID is undefined, using URL ID:", numId);
      agentId = numId;
    }
    
    console.log("[ON REJECT] Agent ID to use:", agentId, "Type:", typeof agentId);
    console.log("[ON REJECT] Final Reason:", finalReason);
    
    if (!agentId || isNaN(Number(agentId))) {
      console.error("[ON REJECT] Invalid agent ID:", { agentId, numId, agent });
      toast.error("Invalid agent ID - unable to reject");
      return;
    }
    
    const numAgentId = Number(agentId);
    console.log("[ON REJECT] Converted Agent ID:", numAgentId, "Type:", typeof numAgentId);
    console.log("[ON REJECT] Calling rejectAgent with ID:", numAgentId, "and reason:", finalReason);
    
    try {
      await rejectAgent({ agentId: numAgentId, reason: finalReason });

      setOpenReject(false);
      setSelectedRejectReason("");
      setCustomReason("");
    } catch (error) {
      console.error("[ON REJECT] Error rejecting agent:", error);
    }
  };

  // Check if agent can be approved/rejected (only if partner has approved)
  const canApproveOrReject = agent?.adminStatus === "Approved" && agent?.status === "Pending";

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!agent) {
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
          title="Approve Agent"
          description="Are you sure you want to approve this agent?"
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
          title="Reject Agent"
          description="Please select a reason for rejecting this agent:"
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
                   {agent.form.agentType || "Agent"} • Registration: {agent.form.registrationNumber || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(agent.status || agent.adminStatus)}
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
                  label="ID NUMBER" 
                  value={agent.form.nationalId || agent.form.idNumber || "N/A"} 
                />
                <InfoField 
                  label="TIN Number" 
                  value={agent.form.taxIdentificationNumber || agent.form.tin || "N/A"} 
                />
              </div>
              <div className="space-y-4">
                <InfoField 
                  label="Address" 
                  value={agent.form.address ? 
                    `${agent.form.address.street || ''} ${agent.form.address.city || ''} ${agent.form.address.state || ''} ${agent.form.address.postalCode || ''} ${agent.form.address.country || ''}`.trim() || "N/A" 
                    : "N/A"} 
                  icon={<MapPin className="w-4 h-4" />}
                />
                <InfoField 
                  label="License Number" 
                  value={agent.form.licenseNumber || agent.form.licenseNo || agent.form.businessLicenseNumber || "N/A"} 
                />
                <InfoField 
                  label="License Expiry Date" 
                  value={agent.form.licenseExpiryDate ? new Date(agent.form.licenseExpiryDate).toLocaleDateString("en-US", {
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
              {agent?.adminStatus !== "Approved" 
                ? "This agent must be approved by the partner first before it can be approved/rejected by super admin."
                : "This agent has already been processed."
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
            {/* Bank Information and Approval Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Bank Information Column */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Bank Information</h4>
                </div>
                
                {agent.form.bankAccountInfos && agent.form.bankAccountInfos.length > 0 ? (
                  <div className="space-y-3">
                    {agent.form.bankAccountInfos.map((bank: any, index: number) => (
                      <div key={bank.id || index} className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg border border-blue-200 dark:border-slate-600">
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
                              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Branch Name</p>
                              <p className="text-sm text-gray-900 dark:text-slate-100">{bank.branchName || "N/A"}</p>
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

              {/* Approval Details Column */}
                  <div className="space-y-4">
                     <InfoField 
                       label="Approved/Rejected By" 
                       value={agent.form.approvedBy || agent.form.rejectedBy || "N/A"} 
                       icon={<User className="w-4 h-4" />}
                     />
                <InfoField 
                  label="Approved/Rejected At" 
                  value={agent.form.approvedAt || agent.form.rejectedAt ? new Date(agent.form.approvedAt || agent.form.rejectedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "N/A"} 
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoField 
                  label="Status" 
                  value={agent.status || "N/A"} 
                  icon={<CheckCircle className="w-4 h-4" />}
                    />
                  </div>
                </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentPreview 
              documents={agent.docs && agent.docs.length > 0 ? agent.docs.map((doc: any, index: number) => ({
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
                  name: 'Agent License',
                  type: 'License Document',
                  uploadedAt: new Date().toISOString(),
                  status: 'Approved' as const,
                  url: '#',
                  size: '1.2 MB'
                },
                {
                  id: 'doc-2',
                  name: 'Identity Verification',
                  type: 'Identity Document',
                  uploadedAt: new Date(Date.now() - 86400000).toISOString(),
                  status: 'Pending' as const,
                  url: '#',
                  size: '0.8 MB'
                }
              ]}
              title="Agent Documents"
            />
          </TabsContent>

        </Tabs>
      </Card>
    </div>
  );
};

export default AgentDetailsPage;
