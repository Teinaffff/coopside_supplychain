import { Institution } from "./institution";

interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Consumer extends Timestamps {
  id: number;
  employeeId: string;
  nationalIdNumber: string;
  tin: string;
  bankAccountNumber: string;
  mobileNumber: string;
  fullLegalName: string;
  jobTitle: string;
  department: string;
  employmentType: "PERMANENT" | "CONTRACT" | "TEMPORARY";
  employmentStartDate: string;
  employmentStatus: "ACTIVE" | "INACTIVE" | "TERMINATED";
  institution: Institution;
  supervisorName: string;
  workEmail: string;
  grossSalary: number;
  netSalary: number;
  pensionDeduction: number;
  incomeTaxDeduction: number;
  otherDeductions: number;
  salaryFrequency: "MONTHLY" | "WEEKLY" | "BIWEEKLY";
  payCycleTiming: string;
  salaryDeductionConsent: boolean;
  terminationRepaymentConsent: boolean;
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  numberOfDependents: number;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAddress: string;
  createdBy: number;
  onboardingStatus: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt?: string | null;
  approvedBy?: number | null;
  rejectionReason?: string | null;
}
