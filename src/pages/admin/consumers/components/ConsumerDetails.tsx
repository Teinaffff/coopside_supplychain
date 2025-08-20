import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  MapPin,
  Phone,
  User,
  Users,
  XCircle
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import coopImage from "../../../../assets/images/coop.png";
import { consumersMockData } from "../../../../common/data/data";
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
import { Consumer } from "../../../../constants/interface/admin/consumer";
import OverlayCard from "../../components/OverlayCard";

// Fetch employee by ID
const fetchEmployeeById = async (id: string): Promise<Consumer> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const employee = consumersMockData.find((emp) => emp.id.toString() === id);
  if (!employee) {
    throw new Error(`Employee with ID ${id} not found`);
  }
  return employee;
};

// Reusable Loading Component
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading employee details...</p>
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
        Employee Not Found
      </h2>
      <p className="text-gray-600 mb-4">
        {error instanceof Error
          ? error.message
          : "The requested employee could not be found."}
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Employees
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

// Employment Status Component
interface EmploymentStatusProps {
  status: string;
}

const EmploymentStatus: React.FC<EmploymentStatusProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>{status}</Badge>
  );
};

// Onboarding Status Component
interface OnboardingStatusProps {
  status: string;
}

const OnboardingStatus: React.FC<OnboardingStatusProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>{status}</Badge>
  );
};

// Consent Status Component
interface ConsentStatusProps {
  label: string;
  status: boolean;
}

const ConsentStatus: React.FC<ConsentStatusProps> = ({ label, status }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <div className="flex items-center space-x-2">
      {status ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span
        className={`text-sm font-medium ${
          status ? "text-green-600" : "text-red-600"
        }`}
      >
        {status ? "Provided" : "Not Provided"}
      </span>
    </div>
  </div>
);

// Currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
  }).format(amount);
};

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch employee data
  const {
    data: employee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployeeById(id!),
    enabled: !!id,
  });

  // Handler functions
  const handleBack = () => {
    navigate("/admin/consumers");
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !employee) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Employee profile updated", timestamp: "2 hours ago" },
    { action: "Onboarding status changed", timestamp: "1 day ago" },
    { action: "Employee registered", timestamp: "5 days ago" },
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
        Back to Consumers
      </Button>

      {/* Header Section - Enhanced with OverlayCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Profile Image Card using OverlayCard */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-6">
            <OverlayCard
              imageUrl={employee.institution.logoUrl || coopImage}
              altText={employee.fullLegalName}
              title={employee.fullLegalName}
              subtitle={`ID: ${employee.employeeId}`}
              badgeText={employee.jobTitle}
              isActive={employee.employmentStatus === "ACTIVE"}
              height="h-[280px]"
              className="w-full"
            />
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {employee.institution.mainOfficeAddress}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Employee Information</span>
              <div className="flex space-x-2">
                <EmploymentStatus status={employee.employmentStatus} />
                <OnboardingStatus status={employee.onboardingStatus} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField label="Employee ID" value={employee.employeeId} />
                <InfoField label="Work Email" value={employee.workEmail} />
                <InfoField
                  label="Mobile Number"
                  value={employee.mobileNumber}
                />
                <InfoField label="Department" value={employee.department} />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoField label="Job Title" value={employee.jobTitle} />
                <InfoField label="Supervisor" value={employee.supervisorName} />
                <InfoField
                  label="Employment Type"
                  value={employee.employmentType}
                />
                <InfoField
                  label="Start Date"
                  value={new Date(
                    employee.employmentStartDate
                  ).toLocaleDateString()}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Employee Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Full Legal Name"
                    value={employee.fullLegalName}
                  />
                  <InfoField label="Employee ID" value={employee.employeeId} />
                  <InfoField label="Job Title" value={employee.jobTitle} />
                  <InfoField label="Department" value={employee.department} />
                  <InfoField
                    label="Supervisor"
                    value={employee.supervisorName}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Employee Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<DollarSign className="w-8 h-8 mx-auto" />}
                value={formatCurrency(employee.grossSalary)}
                label="Gross Salary"
                colorClass="text-green-600"
              />
              <SummaryCard
                icon={<DollarSign className="w-8 h-8 mx-auto" />}
                value={formatCurrency(employee.netSalary)}
                label="Net Salary"
                colorClass="text-blue-600"
              />
              <SummaryCard
                icon={<Users className="w-8 h-8 mx-auto" />}
                value={employee.numberOfDependents.toString()}
                label="Dependents"
                colorClass="text-purple-600"
              />
              <SummaryCard
                icon={<Building2 className="w-8 h-8 mx-auto" />}
                value={employee.employmentType}
                label="Employment Type"
                colorClass="text-orange-600"
              />
            </div>
          </div>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Employment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Employment Type"
                    value={employee.employmentType}
                  />
                  <InfoField
                    label="Employment Status"
                    value={
                      <EmploymentStatus status={employee.employmentStatus} />
                    }
                  />
                  <InfoField
                    label="Start Date"
                    value={new Date(
                      employee.employmentStartDate
                    ).toLocaleDateString()}
                  />
                  <InfoField
                    label="Onboarding Status"
                    value={
                      <OnboardingStatus status={employee.onboardingStatus} />
                    }
                  />
                  {employee.approvedAt && (
                    <InfoField
                      label="Approved Date"
                      value={new Date(employee.approvedAt).toLocaleDateString()}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Institution Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Institution Name"
                    value={employee.institution.fullLegalName}
                  />
                  <InfoField
                    label="Institution Type"
                    value={employee.institution.institutionType}
                  />
                  <InfoField
                    label="Business Sector"
                    value={employee.institution.businessSector}
                  />
                  <InfoField
                    label="Contact Email"
                    value={employee.institution.contactEmail}
                  />
                  <InfoField
                    label="Contact Phone"
                    value={employee.institution.contactPhone}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Salary Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Gross Salary"
                    value={formatCurrency(employee.grossSalary)}
                  />
                  <InfoField
                    label="Net Salary"
                    value={formatCurrency(employee.netSalary)}
                  />
                  <InfoField
                    label="Salary Frequency"
                    value={employee.salaryFrequency}
                  />
                  <InfoField
                    label="Pay Cycle Timing"
                    value={employee.payCycleTiming}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Deductions & Banking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Pension Deduction"
                    value={formatCurrency(employee.pensionDeduction)}
                  />
                  <InfoField
                    label="Income Tax Deduction"
                    value={formatCurrency(employee.incomeTaxDeduction)}
                  />
                  <InfoField
                    label="Other Deductions"
                    value={formatCurrency(employee.otherDeductions)}
                  />
                  <InfoField
                    label="Bank Account"
                    value={`****${employee.bankAccountNumber.slice(-4)}`}
                  />
                  <InfoField label="TIN" value={employee.tin} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="National ID Number"
                    value={employee.nationalIdNumber}
                  />
                  <InfoField
                    label="Mobile Number"
                    value={employee.mobileNumber}
                  />
                  <InfoField
                    label="Marital Status"
                    value={employee.maritalStatus}
                  />
                  <InfoField
                    label="Number of Dependents"
                    value={employee.numberOfDependents}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Contact Name"
                    value={employee.emergencyContactName}
                  />
                  <InfoField
                    label="Relationship"
                    value={employee.emergencyContactRelationship}
                  />
                  <InfoField
                    label="Phone Number"
                    value={employee.emergencyContactPhone}
                  />
                  <InfoFieldStart
                    label="Address"
                    value={employee.emergencyContactAddress}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Consent Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Consent & Agreements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ConsentStatus
                    label="Salary Deduction Consent"
                    status={employee.salaryDeductionConsent}
                  />
                  <ConsentStatus
                    label="Termination Repayment Consent"
                    status={employee.terminationRepaymentConsent}
                  />
                </div>
              </CardContent>
            </Card>
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
                  <ActivityItem
                    key={index}
                    action={activity.action}
                    timestamp={activity.timestamp}
                  />
                ))}
                {employee.approvedAt && (
                  <ActivityItem
                    action={`Employee approved by user ${employee.approvedBy}`}
                    timestamp={new Date(
                      employee.approvedAt
                    ).toLocaleDateString()}
                  />
                )}
                {employee.createdAt && (
                  <ActivityItem
                    action="Employee created"
                    timestamp={new Date(
                      employee.createdAt
                    ).toLocaleDateString()}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmployeeDetails;
