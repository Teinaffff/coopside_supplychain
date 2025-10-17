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
  status: "Active" | "Inactive" | "Pending";
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
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Handler functions
  const handleBack = () => {
    navigate(-1); // Go back to previous page (consumer list or approval management)
  };

  const onApprove = async () => {
    try {
      await API.post(`/v1/consumers/${id}/approve`);
      setOpenApprove(false);
      toast.success("Consumer approved successfully!");
      
      // Update consumer status locally
      if (consumer) {
        setConsumer({ ...consumer, status: "Active" });
      }
    } catch (error: any) {
      console.error("Error approving consumer:", error);
      toast.error(error?.response?.data?.message || "Failed to approve consumer");
    }
  };

  const onReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await API.post(`/v1/consumers/${id}/reject?reason=${rejectReason}`);
      setOpenReject(false);
      setRejectReason("");
      toast.success("Consumer rejected successfully!");
    } catch (error: any) {
      console.error("Error rejecting consumer:", error);
      toast.error(error?.response?.data?.message || "Failed to reject consumer");
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
        
        if (consumerData) {
          // Transform consumer data
          const transformedConsumer: Consumer = {
            id: consumerData.id,
            fullName: consumerData.fullName || consumerData.name || `Consumer ${consumerData.id}`,
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
            status: consumerData.status === "ACTIVE" ? "Active" : 
                    consumerData.status === "INACTIVE" ? "Inactive" : "Pending",
            createdAt: consumerData.createdAt || new Date().toISOString(),
            institutionId: consumerData.institutionId || 0,
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
    const statusUpper = status?.toUpperCase();
    const isActive = statusUpper === "ACTIVE";
    const badgeLabel = isActive ? "Active" : statusUpper === "INACTIVE" ? "Inactive" : "Pending";
    const badgeClass = isActive ? "bg-cyan-500" : statusUpper === "INACTIVE" ? "bg-red-500 text-white" : "bg-yellow-500";
    
    return (
      <Badge variant={isActive ? "default" : "secondary"} className={badgeClass}>
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
          title="Approve Consumer"
          description="Are you sure you want to approve this consumer?"
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
          title="Reject Consumer"
          description="Please provide a reason for rejecting this consumer:"
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
                  Consumer • ID: {consumer.nationalId || consumer.id}
                </p>
                {institution && (
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Institution: {institution.fullLegalName || institution.name}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <Button
            variant="destructive"
            onClick={() => setOpenReject(true)}
            disabled={consumer.status === "Inactive"}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject {`${consumer.superAdminApprovalStatus} ${consumer.adminApproval}`}
          </Button>
          <Button
            onClick={() => setOpenApprove(true)}
            disabled={consumer.status === "Active"}
            className="bg-cyan-600 hover:bg-cyan-700"
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
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
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

export default ConsumerDetailsPage;
