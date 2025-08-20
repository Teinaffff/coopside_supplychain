interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Institution extends Timestamps {
  id: number;
  fullLegalName: string;
  yearOfEstablishment: number;
  businessSector: string;
  tin: string;
  vatRegistrationCertificate: string;
  currentCapital: number;
  permanentEmployees: number;
  contractualEmployees: number;
  totalBranches: number;
  totalAssetValuation: number;
  organizationalStructure: string;
  contactEmail: string;
  contactPhone: string;
  mainOfficeAddress: string;
  institutionType: string;
  businessLicenseNumber: string;
  establishmentProclamation: string;
  employeeConsentProvided: boolean;
  monthlyPayrollCommitment: boolean;
  employeeTerminationNotificationAgreement: boolean;
  outstandingReceivablesPriorityAgreement: boolean;
  loanRepaymentDeductionAgreement: boolean;
  digitalChannelUsageAgreement: boolean;
  onboardingStatus: string;
  onboardedBy: number;
  approvedAt?: string | null;
  approvedBy?: number | null;
  rejectionReason?: string | null;
  logoUrl?: string;
}

export interface InstitutionBranch {
  id: number;
  institution: Institution;
  branchName: string;
  address: string;
  phoneNumber: string;
  email: string;
  branchManager: string;
  isActive: boolean;
}
