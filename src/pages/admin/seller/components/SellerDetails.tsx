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
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
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
import { Seller } from "../../../../constants/interface/admin/seller";
import OverlayCard from "../../components/OverlayCard";
import { useSellers } from "../../hooks/use-sellers";

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
        Seller Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested seller could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sellers
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
    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
      {label}
    </span>
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
    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
      {label}
    </span>
    <div className="text-sm text-gray-900 dark:text-slate-100 text-right">
      {value}
    </div>
  </div>
);

// Reusable Status Button Component
interface StatusButtonProps {
  seller: Seller;
  isLoading: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({ seller, isLoading }) => (
  <Button
    variant={seller.isActive ? "destructive" : "default"}
    size="sm"
    // onClick={() => onStatusChange(!seller.isActive)}
    disabled={isLoading}
  >
    {seller.isActive ? (
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
      <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
        {action}
      </div>
      <div className="text-xs text-gray-500 dark:text-slate-400">
        {timestamp}
      </div>
    </div>
  </div>
);

const SellerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sellers, isLoading } = useSellers({ isFetchSellers: true });
  const seller = sellers?.find(
    (seller: Seller) => seller?.id?.toString() === id
  );

  // Handler functions
  const handleBack = () => {
    navigate("/admin/sellers");
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!seller) {
    return <ErrorState onBack={handleBack} />;
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
        Back to Sellers
      </Button>

      {/* Header Section - Enhanced with Beautiful Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Profile Image Card */}
        <Card className="lg:col-span-1 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 text-center">
            <OverlayCard
              imageUrl={seller.profilePictureUrl}
              altText={seller.fullName}
              title={seller.fullName}
              subtitle={`@${seller.username}`}
              badgeText={seller.agentType}
              isActive={Boolean(seller.isActive)}
            />
          </CardContent>
        </Card>

        {/* Seller Information Card */}
        <Card className="lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <span>Seller Information</span>
              <div className="flex items-center space-x-2">
                <StatusButton seller={seller} isLoading={isLoading} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField label="Email" value={seller.email} />
                <InfoField label="Phone" value={seller.phoneNumber} />
                <InfoField label="ID Number" value={seller.idNumber} />
                <InfoField
                  label="Status"
                  value={
                    <Badge variant={seller.isActive ? "default" : "secondary"}>
                      {seller.isActive ? "Active" : "Inactive"}
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
                      {seller.commissionRate}%
                    </span>
                  }
                />
                <InfoField
                  label="Joined Date"
                  value={new Date(seller.createdAt ?? "").toLocaleDateString(
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
                      <div>{seller.address.street}</div>
                      <div>
                        {seller.address.city}, {seller.address.state}{" "}
                        {seller.address.postalCode}
                      </div>
                      <div>{seller.address.country}</div>
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
          <TabsTrigger
            value="overview"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seller Profile Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <User className="w-5 h-5" />
                  <span>Seller Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField label="Full Name" value={seller.fullName} />
                  <InfoField label="Username" value={`@${seller.username}`} />
                  <InfoField label="Agent Type" value={seller.agentType} />
                  <InfoField
                    label="Status"
                    value={
                      <Badge
                        variant={seller.isActive ? "default" : "secondary"}
                      >
                        {seller.isActive ? "Active" : "Inactive"}
                      </Badge>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seller Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={`${seller.commissionRate}%`}
                label="Commission Rate"
                colorClass="text-blue-600 dark:text-blue-400"
              />
              <SummaryCard
                icon={<IdCard className="w-8 h-8 mx-auto" />}
                value={seller.idNumber}
                label="ID Number"
                colorClass="text-green-600 dark:text-green-400"
              />
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={`****${seller.bankAccountNumber?.slice(-4)}`}
                label="Bank Account"
                colorClass="text-purple-600 dark:text-purple-400"
              />
              <SummaryCard
                icon={<IdCard className="w-8 h-8 mx-auto" />}
                value={seller.taxIdentificationNumber}
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
                    value={`${seller.commissionRate}%`}
                  />
                  <InfoField
                    label="Bank Account"
                    value={`****${seller.bankAccountNumber?.slice(-4)}`}
                  />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Tax ID"
                    value={seller.taxIdentificationNumber}
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

export default SellerDetails;
