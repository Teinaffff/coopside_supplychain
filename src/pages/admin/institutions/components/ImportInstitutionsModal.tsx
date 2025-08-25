import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    transformNumeric,
    validateBoolean,
    validateEmail,
    validateNumeric,
} from "../../../../lib/validation-utils";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useImportInstitutionsModal } from "../../hooks/use-import-institutions-modal";
import { useInstitutions } from "../../hooks/use-institutions";

const INSTITUTION_COLUMNS: ExpectedColumn[] = [
  {
    field: "fullLegalName",
    required: true,
    description: "Full legal name of the institution",
  },
  {
    field: "yearOfEstablishment",
    required: true,
    description: "Year of establishment",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "businessSector",
    required: true,
    description: "Business sector",
  },
  {
    field: "tin",
    required: true,
    description: "TIN number",
  },
  {
    field: "vatRegistrationCertificate",
    required: true,
    description: "VAT registration certificate",
  },
  {
    field: "currentCapital",
    required: true,
    description: "Current capital amount",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "permanentEmployees",
    required: true,
    description: "Number of permanent employees",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "contractualEmployees",
    required: true,
    description: "Number of contractual employees",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "totalBranches",
    required: true,
    description: "Total number of branches",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "totalAssetValuation",
    required: true,
    description: "Total asset valuation",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "organizationalStructure",
    required: true,
    description: "Organizational structure",
  },
  {
    field: "contactEmail",
    required: true,
    description: "Contact email address",
    validator: validateEmail,
  },
  {
    field: "contactPhone",
    required: true,
    description: "Contact phone number",
  },
  {
    field: "mainOfficeAddress",
    required: true,
    description: "Main office address",
  },
  {
    field: "institutionType",
    required: true,
    description: "Type of institution",
  },
  {
    field: "businessLicenseNumber",
    required: true,
    description: "Business license number",
  },
  {
    field: "establishmentProclamation",
    required: true,
    description: "Establishment proclamation",
  },
  {
    field: "employeeConsentProvided",
    required: true,
    description: "Employee consent provided (true/false)",
    validator: validateBoolean,
    transformer: transformBoolean,
  },
  {
    field: "monthlyPayrollCommitment",
    required: true,
    description: "Monthly payroll commitment (true/false)",
    validator: validateBoolean,
    transformer: transformBoolean,
  },
  {
    field: "onboardingStatus",
    required: true,
    description: "Onboarding status",
  },
];

const TEMPLATE_DATA = [
  [
    "ABC Financial Institution",
    "2010",
    "Financial Services",
    "TIN123456789",
    "VAT987654321",
    "10000000",
    "150",
    "50",
    "5",
    "50000000",
    "Hierarchical",
    "contact@abcfinancial.com",
    "+1234567890",
    "123 Main St, Addis Ababa",
    "Bank",
    "BL123456",
    "Proclamation 2010/001",
    "true",
    "true",
    "PENDING",
  ],
];

const convertRowToInstitution = (
  row: any,
  columnMapping: Record<string, string>
): any => {
  const getFieldValue = (fieldName: string) => {
    const mappedColumn = columnMapping[fieldName];
    return mappedColumn ? row[mappedColumn] : undefined;
  };

  const getBooleanValue = (fieldName: string) => {
    const value = getFieldValue(fieldName);
    if (value !== undefined) {
      const val = value.toString().toLowerCase();
      return ["true", "1", "yes"].includes(val);
    }
    return false;
  };

  return {
    fullLegalName: getFieldValue("fullLegalName")?.toString() || "",
    yearOfEstablishment: Number(getFieldValue("yearOfEstablishment")) || new Date().getFullYear(),
    businessSector: getFieldValue("businessSector")?.toString() || "",
    tin: getFieldValue("tin")?.toString() || "",
    vatRegistrationCertificate: getFieldValue("vatRegistrationCertificate")?.toString() || "",
    currentCapital: Number(getFieldValue("currentCapital")) || 0,
    permanentEmployees: Number(getFieldValue("permanentEmployees")) || 0,
    contractualEmployees: Number(getFieldValue("contractualEmployees")) || 0,
    totalBranches: Number(getFieldValue("totalBranches")) || 1,
    totalAssetValuation: Number(getFieldValue("totalAssetValuation")) || 0,
    organizationalStructure: getFieldValue("organizationalStructure")?.toString() || "",
    contactEmail: getFieldValue("contactEmail")?.toString() || "",
    contactPhone: getFieldValue("contactPhone")?.toString() || "",
    mainOfficeAddress: getFieldValue("mainOfficeAddress")?.toString() || "",
    institutionType: getFieldValue("institutionType")?.toString() || "",
    businessLicenseNumber: getFieldValue("businessLicenseNumber")?.toString() || "",
    establishmentProclamation: getFieldValue("establishmentProclamation")?.toString() || "",
    employeeConsentProvided: getBooleanValue("employeeConsentProvided"),
    monthlyPayrollCommitment: getBooleanValue("monthlyPayrollCommitment"),
    employeeTerminationNotificationAgreement: false,
    outstandingReceivablesPriorityAgreement: false,
    loanRepaymentDeductionAgreement: false,
    digitalChannelUsageAgreement: false,
    onboardingStatus: getFieldValue("onboardingStatus")?.toString() || "PENDING",
  };
};

export const ImportInstitutionsModal = () => {
  const { isOpen, onClose } = useImportInstitutionsModal();
  const { handleAddInstitution } = useInstitutions();

  const handleBulkSubmit = async (institutions: any[]) => {
    for (const institution of institutions) {
      await handleAddInstitution(institution);
    }
  };

  return (
    <GenericImportModal<any>
      isOpen={isOpen}
      onClose={onClose}
      entityName="Institution"
      expectedColumns={INSTITUTION_COLUMNS}
      rowToEntity={convertRowToInstitution}
      onSubmit={handleBulkSubmit}
      templateData={TEMPLATE_DATA}
    />
  );
};
