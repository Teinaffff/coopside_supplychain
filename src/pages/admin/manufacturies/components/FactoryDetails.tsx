import { useQuery } from "@tanstack/react-query";
import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    Clock,
    CreditCard,
    Factory,
    Globe,
    MapPin,
    Package,
    Users,
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import coopImage from "../../../../assets/images/coop.png";
import { manufacturersMockData } from "../../../../common/data/data";
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
import { Manufacturer } from "../../../../constants/interface/admin/manufacturer";
import OverlayCard from "../../components/OverlayCard";

// Function to fetch a single manufacturer by ID
const fetchManufacturerById = async (
  manufacturerId: string
): Promise<Manufacturer> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const manufacturer = manufacturersMockData.find(
    (manufacturer) => manufacturer.id.toString() === manufacturerId
  );
  if (!manufacturer) {
    throw new Error(`Factory with ID ${manufacturerId} not found`);
  }
  return manufacturer;
};

// Reusable Loading Component
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading factory details...</p>
    </div>
  </div>
);

// Reusable Error State Component
interface ErrorStateProps {
  error: Error | null;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Factory Not Found
      </h2>
      <p className="text-gray-600 mb-4">
        {error instanceof Error
          ? error.message
          : "The requested factory could not be found."}
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
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-sm text-gray-900">{value}</span>
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
    className={`flex justify-between items-start p-3 bg-gray-50 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <div className="text-sm text-gray-900 text-right">{value}</div>
  </div>
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
  <Card>
    <CardContent className="p-4 text-center">
      <div className={`${colorClass} mb-2`}>{icon}</div>
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </CardContent>
  </Card>
);

// Reusable Activity Item Component
interface ActivityItemProps {
  action: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, timestamp }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="flex-1">
      <div className="text-sm font-medium">{action}</div>
      <div className="text-xs text-gray-500">{timestamp}</div>
    </div>
  </div>
);

const FactoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch manufacturer data
  const {
    data: manufacturer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manufacturer", id],
    queryFn: () => fetchManufacturerById(id!),
    enabled: !!id,
  });

  // Handler functions
  const handleBack = () => {
    navigate("/admin/factories");
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !manufacturer) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Production line updated", timestamp: "2 hours ago" },
    { action: "Quality certification renewed", timestamp: "1 day ago" },
    { action: "Factory registered", timestamp: "5 days ago" },
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
        Back to Factories
      </Button>

      {/* Header Section - Enhanced with OverlayCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Profile Image Card using OverlayCard */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-6">
            <OverlayCard
              imageUrl={coopImage}
              altText={manufacturer.factoryName}
              title={manufacturer.factoryName}
              subtitle={`@${manufacturer.factoryCode}`}
              badgeText={manufacturer.factoryType}
              isActive={true}
              height="h-[280px]"
              className="w-full"
            />
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {manufacturer.headOfficeAddress.city},{" "}
                {manufacturer.headOfficeAddress.country}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Factory Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Factory Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField
                  label="Factory Code"
                  value={manufacturer.factoryCode}
                />
                <InfoField label="Phone" value={manufacturer.phoneNumber} />
                <InfoField
                  label="Contact Person"
                  value={manufacturer.contactPerson}
                />
                <InfoField label="TIN Number" value={manufacturer.tinNumber} />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoField
                  label="Registration No."
                  value={manufacturer.registrationNumber}
                />
                <InfoField
                  label="License No."
                  value={manufacturer.licenseNumber}
                />
                <InfoField
                  label="License Expiry"
                  value={new Date(
                    manufacturer.licenseExpiryDate
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <InfoFieldStart
                  label="Head Office"
                  value={
                    <div>
                      <div>{manufacturer.headOfficeAddress.street}</div>
                      <div>
                        {manufacturer.headOfficeAddress.city},{" "}
                        {manufacturer.headOfficeAddress.state}{" "}
                        {manufacturer.headOfficeAddress.postalCode}
                      </div>
                      <div>{manufacturer.headOfficeAddress.country}</div>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Factory Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Factory className="w-5 h-5" />
                  <span>Factory Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Factory Name"
                    value={manufacturer.factoryName}
                  />
                  <InfoField
                    label="Factory Type"
                    value={manufacturer.factoryType}
                  />
                  <InfoField
                    label="Employees"
                    value={manufacturer.numberOfEmployees.toString()}
                  />
                  <InfoField
                    label="GPS Coordinates"
                    value={manufacturer.gpsCoordinates}
                  />
                  {manufacturer.website && (
                    <InfoField
                      label="Website"
                      value={
                        <a
                          href={manufacturer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {manufacturer.website}
                        </a>
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Factory Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<Users className="w-8 h-8 mx-auto" />}
                value={manufacturer.numberOfEmployees.toString()}
                label="Employees"
                colorClass="text-blue-600"
              />
              <SummaryCard
                icon={<Package className="w-8 h-8 mx-auto" />}
                value={manufacturer.productionCapacity}
                label="Production Capacity"
                colorClass="text-green-600"
              />
              <SummaryCard
                icon={<Building2 className="w-8 h-8 mx-auto" />}
                value={manufacturer.warehouseCapacity}
                label="Warehouse Capacity"
                colorClass="text-purple-600"
              />
              <SummaryCard
                icon={<Globe className="w-8 h-8 mx-auto" />}
                value={manufacturer.preferredCurrency}
                label="Currency"
                colorClass="text-orange-600"
              />
            </div>
          </div>
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Production Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Production Capacity"
                    value={manufacturer.productionCapacity}
                  />
                  <InfoField
                    label="Warehouse Capacity"
                    value={manufacturer.warehouseCapacity}
                  />
                  <InfoFieldStart
                    label="Main Products"
                    value={
                      <div className="space-y-1">
                        {manufacturer.mainProducts.map((product, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="mr-1 mb-1"
                          >
                            {product}
                          </Badge>
                        ))}
                      </div>
                    }
                  />
                  <InfoFieldStart
                    label="Certifications"
                    value={
                      <div className="space-y-1">
                        {manufacturer.certifications.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="mr-1 mb-1"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Production Lines & Equipment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoFieldStart
                    label="Production Lines"
                    value={
                      <div className="space-y-1">
                        {manufacturer.productionLines.map((line, index) => (
                          <div key={index} className="text-sm">
                            {line}
                          </div>
                        ))}
                      </div>
                    }
                  />
                  <InfoFieldStart
                    label="Machinery"
                    value={
                      <div className="space-y-1">
                        {manufacturer.machineryList.map((machine, index) => (
                          <div key={index} className="text-sm">
                            {machine}
                          </div>
                        ))}
                      </div>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <InfoField
                    label="Preferred Currency"
                    value={manufacturer.preferredCurrency}
                  />
                  <InfoField
                    label="Payment Terms"
                    value={manufacturer.paymentTerms}
                  />
                  <InfoField
                    label="Bank Name"
                    value={manufacturer.bankAccountInfo.bankName}
                  />
                  <InfoField
                    label="Account Number"
                    value={`****${manufacturer.bankAccountInfo.accountNumber.slice(
                      -4
                    )}`}
                  />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Account Name"
                    value={manufacturer.bankAccountInfo.accountName}
                  />
                  <InfoField
                    label="Branch"
                    value={manufacturer.bankAccountInfo.branchName}
                  />
                  <InfoField
                    label="SWIFT Code"
                    value={manufacturer.bankAccountInfo.swiftCode}
                  />
                  <InfoField
                    label="IBAN"
                    value={manufacturer.bankAccountInfo.iban}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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
  );
};

export default FactoryDetails;
