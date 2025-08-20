import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  IdCard,
  User,
  XCircle,
} from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { agentsMockData } from "../../../../common/data/data";
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
import { Agent } from "../../../../constants/interface/admin/agent";
import OverlayCard from "../../components/OverlayCard";

// Function to fetch a single agent by ID
const fetchAgentById = async (agentId: string): Promise<Agent> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const agent = agentsMockData.find((agent) => agent.id.toString() === agentId);
  if (!agent) {
    throw new Error(`Agent with ID ${agentId} not found`);
  }
  return agent;
};

// Function to update agent status
const updateAgentStatus = async ({
  agentId,
  status,
}: {
  agentId: string;
  status: boolean;
}): Promise<Agent> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const agent = agentsMockData.find((agent) => agent.id.toString() === agentId);
  if (!agent) {
    throw new Error(`Agent with ID ${agentId} not found`);
  }

  // Update the agent status in mock data
  agent.isActive = status;
  return agent;
};

// Reusable Loading Component
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-slate-300">Loading agent details...</p>
    </div>
  </div>
);

// Reusable Error State Component
interface ErrorStateProps {
  error: Error | null;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
        Agent Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        {error instanceof Error
          ? error.message
          : "The requested agent could not be found."}
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
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">{label}</span>
    <span className="text-sm text-gray-900 dark:text-slate-100">{value}</span>
  </div>
);

// Reusable Info Field with Start Alignment
interface InfoFieldStartProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoFieldStart: React.FC<InfoFieldStartProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`flex justify-between items-start p-3 bg-gray-50 dark:bg-slate-800 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">{label}</span>
    <div className="text-sm text-gray-900 dark:text-slate-100 text-right">{value}</div>
  </div>
);


// Reusable Status Button Component
interface StatusButtonProps {
  agent: Agent;
  onStatusChange: (status: boolean) => void;
  isLoading: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({
  agent,
  onStatusChange,
  isLoading,
}) => (
  <Button
    variant={agent.isActive ? "destructive" : "default"}
    size="sm"
    onClick={() => onStatusChange(!agent.isActive)}
    disabled={isLoading}
  >
    {agent.isActive ? (
      <>
        <XCircle className="w-4 h-4 mr-1" />
        Deactivate
      </>
    ) : (
      <>
        <CheckCircle className="w-4 h-4 mr-1" />
        Activate
      </>
    )}
  </Button>
);

// Reusable Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  value,
  label,
  colorClass,
}) => (
  <Card className="dark:bg-slate-800 dark:border-slate-700">
    <CardContent className="p-4 text-center">
      <div className={`${colorClass} mb-2`}>{icon}</div>
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-gray-600 dark:text-slate-400">{label}</div>
    </CardContent>
  </Card>
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
      <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{action}</div>
      <div className="text-xs text-gray-500 dark:text-slate-400">{timestamp}</div>
    </div>
  </div>
);

const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch agent data
  const {
    data: agent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => fetchAgentById(id!),
    enabled: !!id,
  });

  // Status change mutation
  const statusMutation = useMutation({
    mutationFn: updateAgentStatus,
    onSuccess: () => {
      toast.success("Agent status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["agent", id] });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: () => {
      toast.error("Failed to update agent status");
    },
  });

  // Handler functions
  const handleBack = () => {
    navigate("/admin/agents");
  };

  const handleStatusChange = async (newStatus: boolean) => {
    if (!agent?.id) return;
    statusMutation.mutate({ agentId: agent.id.toString(), status: newStatus });
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !agent) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Logged into system", timestamp: "2 hours ago" },
    { action: "Updated profile information", timestamp: "1 day ago" },
    { action: "Account created", timestamp: "5 days ago" },
  ];

  return (
    <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Agents
      </Button>

      {/* Header Section - Enhanced with Beautiful Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Profile Image Card */}
        <Card className="lg:col-span-1 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 text-center">
            <OverlayCard
              imageUrl={agent.profilePictureUrl}
              altText={agent.fullName}
              title={agent.fullName}
              subtitle={`@${agent.username}`}
              badgeText={agent.agentType}
              isActive={Boolean(agent.isActive)}
            />
          </CardContent>
        </Card>

        {/* Agent Information Card */}
        <Card className="lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <span>Agent Information</span>
              <div className="flex items-center space-x-2">
                <StatusButton
                  agent={agent}
                  onStatusChange={handleStatusChange}
                  isLoading={statusMutation.isPending}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField label="Email" value={agent.email} />
                <InfoField label="Phone" value={agent.phoneNumber} />
                <InfoField label="ID Number" value={agent.idNumber} />
                <InfoField
                  label="Status"
                  value={
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Active" : "Inactive"}
                    </Badge>
                  }
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoField
                  label="Commission Rate"
                  value={
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {agent.commissionRate}%
                    </span>
                  }
                />
                <InfoField
                  label="Joined Date"
                  value={new Date(agent.createdAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                />
                <InfoFieldStart
                  label="Address"
                  value={
                    <div>
                      <div>{agent.address.street}</div>
                      <div>
                        {agent.address.city}, {agent.address.state}{" "}
                        {agent.address.postalCode}
                      </div>
                      <div>{agent.address.country}</div>
                    </div>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 dark:bg-slate-700">
          <TabsTrigger value="overview" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200">Overview</TabsTrigger>
          <TabsTrigger value="financial" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200">Financial</TabsTrigger>
          <TabsTrigger value="activity" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Profile Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <User className="w-5 h-5" />
                  <span>Agent Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField label="Full Name" value={agent.fullName} />
                  <InfoField label="Username" value={`@${agent.username}`} />
                  <InfoField label="Agent Type" value={agent.agentType} />
                  <InfoField
                    label="Status"
                    value={
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Agent Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={`${agent.commissionRate}%`}
                label="Commission Rate"
                colorClass="text-blue-600 dark:text-blue-400"
              />
              <SummaryCard
                icon={<IdCard className="w-8 h-8 mx-auto" />}
                value={agent.idNumber}
                label="ID Number"
                colorClass="text-green-600 dark:text-green-400"
              />
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={`****${agent.bankAccountNumber?.slice(-4)}`}
                label="Bank Account"
                colorClass="text-purple-600 dark:text-purple-400"
              />
              <SummaryCard
                icon={<IdCard className="w-8 h-8 mx-auto" />}
                value={agent.taxIdentificationNumber}
                label="Tax ID"
                colorClass="text-orange-600 dark:text-orange-400"
              />
            </div>
          </div>
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

        {/* Financial Tab */}
        <TabsContent value="financial">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <CreditCard className="w-5 h-5" />
                <span>Financial Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoField
                    label="Commission Rate"
                    value={`${agent.commissionRate}%`}
                  />
                  <InfoField
                    label="Bank Account"
                    value={`****${agent.bankAccountNumber?.slice(-4)}`}
                  />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Tax ID"
                    value={agent.taxIdentificationNumber}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AgentDetails;
