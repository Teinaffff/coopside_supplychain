import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Edit,
  IdCard,
  MoreVertical,
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

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    console.log("Edit agent", agent?.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Agent Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "The requested agent could not be found."}
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Logged into system", timestamp: "2 hours ago" },
    { action: "Updated profile information", timestamp: "1 day ago" },
    { action: "Account created", timestamp: "5 days ago" },
  ];

  return (
    <Card className="px-5 pt-5 pb-10">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Agents
      </Button>

      {/* Header Section - Enhanced with Large Profile Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Image Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                {agent.profilePictureUrl ? (
                  <img
                    src={agent.profilePictureUrl}
                    alt={agent.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2">
                <div
                  className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${
                    agent.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {agent.isActive ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {agent.fullName}
            </h1>
            <p className="text-sm text-gray-500 mb-2">@{agent.username}</p>
            <Badge variant="secondary" className="text-xs">
              {agent.agentType}
            </Badge>
          </CardContent>
        </Card>

        {/* Agent Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Agent Information</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant={agent.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleStatusChange(!agent.isActive)}
                  disabled={statusMutation.isPending}
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
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Email
                  </span>
                  <span className="text-sm text-gray-900">{agent.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Phone
                  </span>
                  <span className="text-sm text-gray-900">
                    {agent.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    ID Number
                  </span>
                  <span className="text-sm text-gray-900">
                    {agent.idNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Status
                  </span>
                  <Badge variant={agent.isActive ? "default" : "secondary"}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Commission Rate
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {agent.commissionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Joined Date
                  </span>
                  <span className="text-sm text-gray-900">
                    {new Date(agent.createdAt ?? "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Address
                  </span>
                  <div className="text-sm text-gray-900 text-right">
                    <div>{agent.address.street}</div>
                    <div>
                      {agent.address.city}, {agent.address.state}{" "}
                      {agent.address.postalCode}
                    </div>
                    <div>{agent.address.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Agent Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Full Name</span>
                    <span className="text-sm font-medium">
                      {agent.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Username</span>
                    <span className="text-sm font-medium">
                      @{agent.username}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Agent Type</span>
                    <span className="text-sm font-medium">
                      {agent.agentType}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Commission Rate */}
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-blue-600 mb-2">
                    <CreditCard className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {agent.commissionRate}%
                  </div>
                  <div className="text-xs text-gray-600">Commission Rate</div>
                </CardContent>
              </Card>

              {/* ID Number */}
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-green-600 mb-2">
                    <IdCard className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {agent.idNumber}
                  </div>
                  <div className="text-xs text-gray-600">ID Number</div>
                </CardContent>
              </Card>

              {/* Bank Account */}
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-purple-600 mb-2">
                    <CreditCard className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    ****{agent.bankAccountNumber?.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-600">Bank Account</div>
                </CardContent>
              </Card>

              {/* Tax ID */}
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-orange-600 mb-2">
                    <IdCard className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {agent.taxIdentificationNumber}
                  </div>
                  <div className="text-xs text-gray-600">Tax ID</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Financial Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Commission Rate
                    </span>
                    <span className="text-sm font-medium">
                      {agent.commissionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Bank Account</span>
                    <span className="text-sm font-medium">
                      ****{agent.bankAccountNumber?.slice(-4)}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Tax ID</span>
                    <span className="text-sm font-medium">
                      {agent.taxIdentificationNumber}
                    </span>
                  </div>
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
