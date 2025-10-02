import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { Button } from "../../../common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogClose,
} from "../../../common/ui/dialog";
import { Textarea } from "../../../common/ui/textarea";
import { useNavigate } from "react-router-dom";
import ApprovalReportingDashboard from "./ApprovalReportingDashboard";
import { Label } from "../../../common/ui/label";
import { Input } from "../../../common/ui/input";
import { useFactories } from "../hooks/use-factories";
import { toast } from "react-hot-toast";

const PREDEFINED_DECLINE_REASONS = [
  "Incomplete documentation",
  "Fails eligibility criteria",
  "Fraudulent information detected",
  "Applicant credit score too low",
  "High risk assessment",
  "Other (please specify)",
];

interface DocItem {
  id: number;
  name: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockData: Record<string, DocItem[]> = {
  factories: [
    { id: 1, name: "Factory License.pdf", uploadedAt: "2023-10-01", status: "Pending" },
  ],
  agents: [
    { id: 2, name: "Agent Permit.pdf", uploadedAt: "2023-09-15", status: "Approved" },
  ],
  institutions: [
    { id: 3, name: "Institution Cert.pdf", uploadedAt: "2023-08-20", status: "Rejected" },
  ],
  consumers: [
    { id: 4, name: "Consumer ID.jpg", uploadedAt: "2023-10-03", status: "Pending" },
  ],
};

const statusClasses: Record<DocItem["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

interface Entity {
  id: number;
  name: string;
  type: "agent" | "factory" | "institution" | "consumer";
  status: "Pending" | "Approved" | "Rejected";
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
  
  // Fetch factories data from API
  const { factories, isLoading: factoriesLoading, error: factoriesError, approveFactory, isApproving } = useFactories();

  const entities: Record<string, Entity[]> = {
    factories: factories,
    agents: [
      {
        id: 4,
        name: "Prime Agents",
        type: "agent",
        status: "Approved",
        docs: mockData.agents,
        form: { fullName:"Prime Agents", licenseNo: "AG-123", phone: "+123456789" },
      },
      {
        id: 5,
        name: "Sunrise Traders",
        type: "agent",
        status: "Pending",
        docs: mockData.agents,
        form: { fullName:"Sunrise Traders", licenseNo: "AG-456", phone: "+987654321" },
      },
      {
        id: 6,
        name: "MegaMart Sellers",
        type: "agent",
        status: "Rejected",
        docs: mockData.agents,
        form: { fullName:"MegaMart Sellers", licenseNo: "AG-789", phone: "+112233445" },
      },
    ],
    institutions: [
      {
        id: 101,
        name: "Ethiopian Airlines",
        type: "institution",
        status: "Approved",
        docs: mockData.institutions,
        form: {
          id: 101,
          fullLegalName: "Ethiopian Airlines",
          yearOfEstablishment: 1945,
          businessSector: "Aviation",
          tin: "0001112223",
          vatRegistrationCertificate: "VAT-ET-AL-123",
          currentCapital: "500000000",
          permanentEmployees: 14000,
          contractualEmployees: 1200,
          totalBranches: 35,
          totalAssetValuation: "2300000000",
          organizationalStructure: "Hierarchical corporate structure",
          contactEmail: "contact@ethiopianairlines.com",
          contactPhone: "+251-111-234567",
          mainOfficeAddress: "Addis Ababa, Ethiopia",
          institutionType: "PUBLIC",
          businessLicenseNumber: "BL-001-2020",
          establishmentProclamation: "Proclamation No. 123/2010",
          employeeConsentProvided: true,
          monthlyPayrollCommitment: true,
          employeeTerminationNotificationAgreement: true,
          outstandingReceivablesPriorityAgreement: true,
          loanRepaymentDeductionAgreement: true,
          digitalChannelUsageAgreement: true,
          onboardingStatus: "Approved",
          onboardedBy: 1,
          createdAt: "2024-01-01T10:00:00",
          approvedAt: "2024-01-10T10:00:00",
          approvedBy: 2,
          rejectionReason: "",
        },
      },
      {
        id: 102,
        name: "Hawassa University",
        type: "institution",
        status: "Pending",
        docs: mockData.institutions,
        form: {
          id: 102,
          fullLegalName: "Hawassa University",
          yearOfEstablishment: 1999,
          businessSector: "Education",
          tin: "2003004005",
          vatRegistrationCertificate: "",
          currentCapital: "30000000",
          permanentEmployees: 5000,
          contractualEmployees: 400,
          totalBranches: 7,
          totalAssetValuation: "350000000",
          organizationalStructure: "University governance",
          contactEmail: "info@hu.edu.et",
          contactPhone: "+251-462-220000",
          mainOfficeAddress: "Hawassa, Ethiopia",
          institutionType: "PUBLIC",
          businessLicenseNumber: "",
          establishmentProclamation: "Proclamation No. 456/2005",
          employeeConsentProvided: false,
          monthlyPayrollCommitment: false,
          employeeTerminationNotificationAgreement: false,
          outstandingReceivablesPriorityAgreement: false,
          loanRepaymentDeductionAgreement: false,
          digitalChannelUsageAgreement: false,
          onboardingStatus: "Pending",
          onboardedBy: 3,
          createdAt: "2024-02-01T09:00:00",
          approvedAt: "",
          approvedBy: "",
          rejectionReason: "",
        },
      },
      {
        id: 103,
        name: "Bahir Dar University",
        type: "institution",
        status: "Rejected",
        docs: mockData.institutions,
        form: {
          id: 103,
          fullLegalName: "Bahir Dar University",
          yearOfEstablishment: 2000,
          businessSector: "Education",
          tin: "3004005006",
          vatRegistrationCertificate: "VAT-ET-BDU-456",
          currentCapital: "25000000",
          permanentEmployees: 4200,
          contractualEmployees: 350,
          totalBranches: 6,
          totalAssetValuation: "280000000",
          organizationalStructure: "University governance",
          contactEmail: "info@bdu.edu.et",
          contactPhone: "+251-582-200000",
          mainOfficeAddress: "Bahir Dar, Ethiopia",
          institutionType: "PUBLIC",
          businessLicenseNumber: "",
          establishmentProclamation: "Proclamation No. 789/2006",
          employeeConsentProvided: false,
          monthlyPayrollCommitment: false,
          employeeTerminationNotificationAgreement: false,
          outstandingReceivablesPriorityAgreement: false,
          loanRepaymentDeductionAgreement: false,
          digitalChannelUsageAgreement: false,
          onboardingStatus: "Rejected",
          onboardedBy: 4,
          createdAt: "2024-03-01T11:30:00",
          approvedAt: "",
          approvedBy: "",
          rejectionReason: "Insufficient documentation",
        },
      },
    ],
    consumers: [
      {
        id: 10,
        name: "Teina Tesfaye",
        type: "consumer",
        status: "Pending",
        docs: mockData.consumers,
        form: { fullName: "Teina Tesfaye", idNumber: "1234567890", mobile: "+987654321" },
      },
      {
        id: 11,
        name: "Samuel Kebede",
        type: "consumer",
        status: "Approved",
        docs: mockData.consumers,
        form: { fullName: "Samuel Kebede", idNumber: "9876543210", mobile: "+251901234567" },
      },
      {
        id: 12,
        name: "Lulit Bekele",
        type: "consumer",
        status: "Rejected",
        docs: mockData.consumers,
        form: { fullName: "Lulit Bekele", idNumber: "555666777", mobile: "+251911223344" },
      },
    ],
  };
  
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [actionLoading, setActionLoading] = useState<null | "approve" | "decline">(null);
  const [declineReason, setDeclineReason] = useState<string>("");
  const [selectedDeclineReason, setSelectedDeclineReason] = useState<string>("");
  
  const handleApprove = () => {
    if (!selectedEntity) return;
    
    // Handle factory approval specifically
    if (selectedEntity.type === "factory") {
      // Check if factory is already approved
      if (selectedEntity.status === "Approved") {
        toast.error("This factory is already approved.");
        return;
      }
      
      approveFactory(selectedEntity.id);
      setSelectedEntity(null);
      setDeclineReason("");
      return;
    }
    
    // For other entity types, keep the existing behavior for now
    setActionLoading("approve");
    // TODO: integrate API for other entity types
    setTimeout(() => {
      selectedEntity.status = "Approved";
      setActionLoading(null);
      setSelectedEntity(null);
      setDeclineReason("");
    }, 800);
  };

  const handleDecline = () => {
    if (!selectedEntity) return;
    setActionLoading("decline");
    // TODO: integrate API
    console.log("Declining entity with reason:", declineReason);
    setTimeout(() => {
      selectedEntity.status = "Rejected";
      setActionLoading(null);
      setSelectedEntity(null);
      setDeclineReason(""); // Clear decline reason after action
      setSelectedDeclineReason(""); // Clear selected radio reason
    }, 800);
  };
  
  const navigate = useNavigate();
  
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

    const visible = filter === "All" ? list : list.filter((e) => e.status === filter);

    const handleViewClick = (evt: React.MouseEvent, entity: Entity) => {
      evt.stopPropagation();
      if (entity.type === "institution") {
        if (entity.status === "Approved") {
          navigate(`/coop/approval/institutions/${entity.id}`);
        } else {
          setSelectedEntity(entity);
        }
      } else {
        setSelectedEntity(entity);
      }
    };

    return (
      <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
          {visible.map((e) => (
            <tr key={e.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700" onClick={() => setSelectedEntity(e)}>
              <td className="px-4 py-2 whitespace-nowrap">{e.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-xs ${statusClasses[e.status]}`}>{e.status}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {e.type === "institution" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(evt)=>{evt.stopPropagation(); setSelectedEntity(e);}}
                    >
                      Preview
                    </Button>
                    {e.status === "Approved" && (
                      <Button
                        size="sm"
                        onClick={(evt)=>{evt.stopPropagation(); navigate(`/coop/approval/institutions/${e.id}`); }}
                      >
                        View
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={(evt)=>handleViewClick(evt, e)}>View</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  const renderEntityDetails = (entity: Entity) => {
    return (
      <Card className="mt-6 border-blue-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle>{entity.name} – Details</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simple form field list */}
          <div>
            <h4 className="font-semibold mb-2">Form Data</h4>
            <table className="w-full text-sm divide-y divide-gray-200 dark:divide-gray-700 rounded-md overflow-hidden">
              <tbody>
                {FIELD_TEMPLATES[entity.type].map(({ key, label }) => (
                  <tr
                    key={key}
                    className="odd:bg-gray-50 even:bg-white dark:odd:bg-slate-800 dark:even:bg-slate-900"
                  >
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-slate-200 w-1/3">{label}</td>
                    <td className="py-2 px-3 text-gray-900 dark:text-slate-100 w-2/3">{entity.form[key] ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Documents */}
          <div>
            <h4 className="font-semibold mb-2">Uploaded Documents</h4>
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">Uploaded</th>
                  <th className="px-4 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                {entity.docs.map((d) => {
                  const isPdf = d.name.toLowerCase().endsWith('.pdf');
                  return (
                    <tr key={d.id}>
                      <td className="px-4 py-1 whitespace-nowrap">{d.name}</td>
                      <td className="px-4 py-1 whitespace-nowrap">{d.uploadedAt}</td>
                      <td className="px-4 py-1 whitespace-nowrap">
                        <Button size="sm" variant="outline" disabled={!isPdf} onClick={() => alert('Pretend opening ' + d.name)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Replace renderTable calls with renderEntitiesTable and add details panel after TabsContent
  
  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Approval Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Status filter */}
          <div className="flex gap-2 mb-4">
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
              {renderEntitiesTable(entities.agents)}
            </TabsContent>
            <TabsContent value="institutions" className="mt-4">
              {renderEntitiesTable(entities.institutions)}
            </TabsContent>
          </Tabs>

          {/* Details dialog */}
          <Dialog open={!!selectedEntity} onOpenChange={(open)=>{if(!open) setSelectedEntity(null);}}>
            <DialogContent className="w-[90vw] max-w-3xl flex flex-col max-h-[90vh]">
              {selectedEntity && (
                <>
                  <DialogHeader className="pb-4">
                    <DialogTitle>{selectedEntity.name} – Details</DialogTitle>
                  </DialogHeader>
                  <div className="flex-grow overflow-auto pr-2">
                    {renderEntityDetails(selectedEntity)}

                    {/* Decline reason section */}
                    <div className="mt-4 space-y-2">
                      <label htmlFor="declineReason" className="text-sm font-medium">Reason for Decline</label>
                      <div className="space-y-2">
                        {PREDEFINED_DECLINE_REASONS.map((reason) => (
                          <div key={reason} className="flex items-center">
                            <Input
                              type="radio"
                              id={reason}
                              value={reason}
                              checked={selectedDeclineReason === reason}
                              onChange={() => {
                                setSelectedDeclineReason(reason);
                                if (reason !== "Other (please specify)") {
                                  setDeclineReason(reason);
                                } else {
                                  setDeclineReason(""); // Clear custom reason if "Other" is deselected
                                }
                              }}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <Label htmlFor={reason} className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                              {reason}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedDeclineReason === "Other (please specify)" && (
                        <Textarea
                          id="customDeclineReason"
                          placeholder="Please specify your reason..."
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="w-full mt-2"
                          rows={3}
                        />
                      )}
                    </div>
                  </div>

                  <DialogFooter className="gap-2 pt-4">
                    <Button variant="destructive" disabled={actionLoading==="decline"} onClick={handleDecline}>
                      {actionLoading==="decline"?"Declining...":"Decline"}
                    </Button>
                    <Button disabled={actionLoading==="approve" || (selectedEntity?.type === "factory" && isApproving)} onClick={handleApprove}>
                      {actionLoading==="approve" || (selectedEntity?.type === "factory" && isApproving) ? "Approving..." : "Approve"}
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalManagementPage;