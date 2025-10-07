import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { Button } from "../../../common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import ApprovalReportingDashboard from "./ApprovalReportingDashboard";
import { useFactories } from "../hooks/use-factories";
import { useAgents } from "../hooks/use-Agents";
import { useInstitutions } from "../hooks/useInstitutions";



interface DocItem {
  id: number;
  name: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}


const statusClasses: Record<DocItem["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

interface Entity {
  id: number;
  name: string;
  type: "agent" | "factory" | "institution" | "consumer";
  status: "Pending" | "Approved" | "Rejected"; // Super Admin Status (this portal)
  adminStatus: "Pending" | "Approved" | "Rejected"; // Admin Status (external portal)
  docs: DocItem[];
  form: Record<string, any>;
}

// Field templates for each actor type
const FIELD_TEMPLATES: Record<Entity["type"], { key: string; label: string }[]> = {
  agent: [
    { key: "fullName", label: "Full Name" },
    { key: "agentId", label: "Agent ID" },
    { key: "nationalId", label: "National ID Number" },
    { key: "tin", label: "TIN Number" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address" },
    { key: "address", label: "Address" },
    { key: "licenseNo", label: "Business License Number" },
    { key: "goodsType", label: "Type of Goods Sold" },
    { key: "linkedOrg", label: "Linked Coop / Institution" },
    { key: "bankAccount", label: "Bank Account Number" },
    { key: "commissionRate", label: "Commission Rate" },
  ],
  factory: [
    { key: "factoryName", label: "Factory Name" },
    { key: "registrationNo", label: "Factory Registration Number" },
    { key: "tin", label: "TIN Number" },
    { key: "contact", label: "Contact Person" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address" },
    { key: "location", label: "Factory Location" },
    { key: "industry", label: "Industry Type" },
    { key: "bankAccount", label: "Bank Account Details" },
    { key: "capacity", label: "Production Capacity" },
    { key: "linkedCoops", label: "Linked Cooperatives" },
  ],
  institution: [
    // A. General Institutional Information
    { key: "id", label: "ID" },
    { key: "fullLegalName", label: "Full Legal Name" },
    { key: "yearOfEstablishment", label: "Year Of Establishment" },
    { key: "businessSector", label: "Business Sector" },
    { key: "tin", label: "TIN" },
    { key: "vatRegistrationCertificate", label: "VAT Registration Certificate" },
    { key: "currentCapital", label: "Current Capital" },
    { key: "permanentEmployees", label: "Permanent Employees" },
    { key: "contractualEmployees", label: "Contractual Employees" },
    { key: "totalBranches", label: "Total Branches" },
    { key: "totalAssetValuation", label: "Total Asset Valuation" },
    { key: "organizationalStructure", label: "Organizational Structure" },
    { key: "contactEmail", label: "Contact Email" },
    { key: "contactPhone", label: "Contact Phone" },
    { key: "mainOfficeAddress", label: "Main Office Address" },
    // B. Legal and Regulatory Documentation
    { key: "institutionType", label: "Institution Type" },
    { key: "businessLicenseNumber", label: "Business License Number" },
    { key: "establishmentProclamation", label: "Establishment Proclamation" },
    // C. Payroll and Consent-Related Requirements
    { key: "employeeConsentProvided", label: "Employee Consent Provided" },
    { key: "monthlyPayrollCommitment", label: "Monthly Payroll Commitment" },
    { key: "employeeTerminationNotificationAgreement", label: "Employee Termination Notification Agreement" },
    { key: "outstandingReceivablesPriorityAgreement", label: "Outstanding Receivables Priority Agreement" },
    { key: "loanRepaymentDeductionAgreement", label: "Loan Repayment Deduction Agreement" },
    { key: "digitalChannelUsageAgreement", label: "Digital Channel Usage Agreement" },
    // D. System / Onboarding Fields
    { key: "onboardingStatus", label: "Onboarding Status" },
    { key: "onboardedBy", label: "Onboarded By (User ID)" },
    { key: "createdAt", label: "Created At" },
    { key: "approvedAt", label: "Approved At" },
    { key: "approvedBy", label: "Approved By (User ID)" },
    { key: "rejectionReason", label: "Rejection Reason" },
  ],
  consumer: [
    { key: "fullName", label: "Full Name" },
    { key: "nationalId", label: "National ID Number" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address" },
    { key: "gender", label: "Gender" },
    { key: "dob", label: "Date of Birth" },
    { key: "maritalStatus", label: "Marital Status" },
    { key: "address", label: "Address" },
    { key: "occupation", label: "Occupation" },
    { key: "employer", label: "Employer / Institution" },
    { key: "income", label: "Salary Range / Income" },
    { key: "bankAccount", label: "Bank Account" },
    { key: "linkedCoop", label: "Linked Cooperative" },
  ],
};

const ApprovalManagementPage: React.FC = () => {
  const [filter, setFilter] = useState<DocItem["status"] | "All">("All");
  const [statusFilter, setStatusFilter] = useState<"admin" | "superAdmin">("superAdmin");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Fetch real data from APIs
  const { factories, isLoading: factoriesLoading, error: factoriesError, refetch: refetchFactories } = useFactories();
  const { agents, isLoading: agentsLoading, error: agentsError, refetch: refetchAgents } = useAgents();
  const { institutions, isLoading: institutionsLoading, error: institutionsError, refetch: refetchInstitutions } = useInstitutions();

  // Combine all entities for real-time data
  const entities: Record<string, Entity[]> = {
    factories: factories || [],
    institutions: institutions || [],
    agents: agents || [],
  };
  
  const navigate = useNavigate();

  // Refresh all data
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchFactories(),
        refetchAgents(),
        refetchInstitutions()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  
  const renderEntitiesTable = (list: Entity[], isLoading?: boolean, error?: any) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load data</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {error?.message || "An error occurred while fetching data"}
            </p>
          </div>
        </div>
      );
    }

    const visible = filter === "All" ? list : list.filter((e) => {
      const statusToCheck = statusFilter === "admin" ? e.adminStatus : e.status;
      return statusToCheck === filter;
    });

    const handleViewClick = (evt: React.MouseEvent, entity: Entity) => {
      evt.stopPropagation();
      // Navigate to detail pages instead of showing modals
      if (entity.type === "factory") {
        navigate(`/coop/approval/factories/${entity.id}`);
      } else if (entity.type === "agent") {
        navigate(`/coop/approval/agents/${entity.id}`);
      } else if (entity.type === "institution") {
          navigate(`/coop/approval/institutions/${entity.id}`);
      }
    };

    return (
      <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Admin Status</th>
            <th className="px-4 py-2 text-left font-medium">Super Admin Status</th>
            <th className="px-4 py-2 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
          {visible.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
              <td className="px-4 py-2 whitespace-nowrap">{e.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs ${statusClasses[e.adminStatus]}`}>{e.adminStatus}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs ${statusClasses[e.status]}`}>{e.status}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={(evt)=>handleViewClick(evt, e)}>
                    View Details
                  </Button>
                  {e.type === "institution" && e.status === "Approved" && (
                    <Button
                      size="sm"
                      variant="secondary" 
                      onClick={(evt) => {
                        evt.stopPropagation();
                        navigate(`/coop/approval/institutions/${e.id}/consumers`);
                      }}
                    >
                      Consumer List
                      </Button>
                    )}
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  
  // Replace renderTable calls with renderEntitiesTable and add details panel after TabsContent
  
  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Approval Management</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={factoriesLoading || agentsLoading || institutionsLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${(factoriesLoading || agentsLoading || institutionsLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status filter */}
          <div className="flex flex-col gap-4 mb-4">
            {/* Status Type Filter */}
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
              <Button
                size="sm"
                variant={statusFilter === "superAdmin" ? "default" : "outline"}
                onClick={() => setStatusFilter("superAdmin")}
              >
                Status_by_Super_Admin
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "admin" ? "default" : "outline"}
                onClick={() => setStatusFilter("admin")}
              >
                Status_by_Admin
              </Button>
            </div>
            
            {/* Status Value Filter */}
            <div className="flex gap-2">
              {["All", "Pending", "Approved", "Rejected"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={filter === s ? "default" : "outline"}
                  onClick={() => setFilter(s as any)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 dark:bg-slate-700">
              <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
              <TabsTrigger value="factories">🏭 Factories</TabsTrigger>
              <TabsTrigger value="agents">🛒 Agents/Sellers</TabsTrigger>
              <TabsTrigger value="institutions">🏢 Institutions</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <ApprovalReportingDashboard />
            </TabsContent>
            <TabsContent value="factories" className="mt-4">
              {renderEntitiesTable(entities.factories, factoriesLoading, factoriesError)}
            </TabsContent>
            <TabsContent value="agents" className="mt-4">
              {renderEntitiesTable(entities.agents, agentsLoading, agentsError)}
            </TabsContent>
            <TabsContent value="institutions" className="mt-4">
              {renderEntitiesTable(entities.institutions, institutionsLoading, institutionsError)}
            </TabsContent>
          </Tabs>


        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalManagementPage;