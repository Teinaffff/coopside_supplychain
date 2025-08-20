import { z } from "zod";

export const consumerFormSchema = z.object({
  id: z.number().optional(), 
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  nationalIdNumber: z.string().min(1, { message: "National ID number is required" }),
  tin: z.string().min(1, { message: "TIN is required" }),
  bankAccountNumber: z.string().min(1, { message: "Bank account number is required" }),
  mobileNumber: z.string().min(1, { message: "Mobile number is required" }),
  fullLegalName: z.string().min(1, { message: "Full legal name is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  employmentType: z.enum(["PERMANENT", "CONTRACT", "TEMPORARY"], {
    errorMap: () => ({ message: "Employment type must be PERMANENT, CONTRACT, or TEMPORARY" })
  }),
  employmentStartDate: z.string().min(1, { message: "Employment start date is required" }),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE", "TERMINATED"], {
    errorMap: () => ({ message: "Employment status must be ACTIVE, INACTIVE, or TERMINATED" })
  }),
  institutionId: z.number().min(1, { message: "Institution is required" }),
  supervisorName: z.string().min(1, { message: "Supervisor name is required" }),
  workEmail: z.string().email({ message: "Invalid work email format" }),
  grossSalary: z.number().min(0, { message: "Gross salary must be a positive number" }),
  netSalary: z.number().min(0, { message: "Net salary must be a positive number" }),
  pensionDeduction: z.number().min(0, { message: "Pension deduction must be a positive number" }),
  incomeTaxDeduction: z.number().min(0, { message: "Income tax deduction must be a positive number" }),
  otherDeductions: z.number().min(0, { message: "Other deductions must be a positive number" }),
  salaryFrequency: z.enum(["MONTHLY", "WEEKLY", "BIWEEKLY"], {
    errorMap: () => ({ message: "Salary frequency must be MONTHLY, WEEKLY, or BIWEEKLY" })
  }),
  payCycleTiming: z.string().min(1, { message: "Pay cycle timing is required" }),
  salaryDeductionConsent: z.boolean(),
  terminationRepaymentConsent: z.boolean(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"], {
    errorMap: () => ({ message: "Marital status must be SINGLE, MARRIED, DIVORCED, or WIDOWED" })
  }),
  numberOfDependents: z.number().min(0, { message: "Number of dependents must be a positive number" }),
  emergencyContactName: z.string().min(1, { message: "Emergency contact name is required" }),
  emergencyContactRelationship: z.string().min(1, { message: "Emergency contact relationship is required" }),
  emergencyContactPhone: z.string().min(1, { message: "Emergency contact phone is required" }),
  emergencyContactAddress: z.string().min(1, { message: "Emergency contact address is required" }),
  createdBy: z.number().optional(),
  onboardingStatus: z.enum(["PENDING", "APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "Onboarding status must be PENDING, APPROVED, or REJECTED" })
  }),
  approvedAt: z.string().optional().nullable(),
  approvedBy: z.number().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
});

export type ConsumerFormValues = z.infer<typeof consumerFormSchema>;