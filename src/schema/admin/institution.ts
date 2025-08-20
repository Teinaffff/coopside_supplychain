import { z } from "zod";

export const institutionFormSchema = z.object({
  id: z.number().optional(),
  fullLegalName: z.string().min(1, { message: "Full legal name is required" }),
  yearOfEstablishment: z.number().min(1800, { message: "Year of establishment must be valid" }).max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  businessSector: z.string().min(1, { message: "Business sector is required" }),
  tin: z.string().min(1, { message: "TIN is required" }),
  vatRegistrationCertificate: z.string().min(1, { message: "VAT registration certificate is required" }),
  currentCapital: z.number().min(0, { message: "Current capital must be positive" }),
  permanentEmployees: z.number().min(0, { message: "Permanent employees count must be positive" }),
  contractualEmployees: z.number().min(0, { message: "Contractual employees count must be positive" }),
  totalBranches: z.number().min(1, { message: "Total branches must be at least 1" }),
  totalAssetValuation: z.number().min(0, { message: "Total asset valuation must be positive" }),
  organizationalStructure: z.string().min(1, { message: "Organizational structure is required" }),
  contactEmail: z.string().email({ message: "Invalid email format" }),
  contactPhone: z.string().min(1, { message: "Contact phone is required" }),
  mainOfficeAddress: z.string().min(1, { message: "Main office address is required" }),
  institutionType: z.string().min(1, { message: "Institution type is required" }),
  businessLicenseNumber: z.string().min(1, { message: "Business license number is required" }),
  establishmentProclamation: z.string().min(1, { message: "Establishment proclamation is required" }),
  employeeConsentProvided: z.boolean(),
  monthlyPayrollCommitment: z.boolean(),
  employeeTerminationNotificationAgreement: z.boolean(),
  outstandingReceivablesPriorityAgreement: z.boolean(),
  loanRepaymentDeductionAgreement: z.boolean(),
  digitalChannelUsageAgreement: z.boolean(),
  onboardingStatus: z.string().min(1, { message: "Onboarding status is required" }),
  onboardedBy: z.number().optional(),
  approvedAt: z.string().optional().nullable(),
  approvedBy: z.number().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  logoUrl: z.string().optional(),
  logo: z.any().optional().refine((data) => !data || data instanceof File, {
    message: "Logo must be a valid file",
  }),
});

export type InstitutionFormValues = z.infer<typeof institutionFormSchema>;