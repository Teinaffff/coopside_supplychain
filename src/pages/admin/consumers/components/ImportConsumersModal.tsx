import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    transformNumeric,
    validateBoolean,
    validateEmail,
    validateNumeric,
} from "../../../../lib/validation-utils";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useConsumers } from "../../hooks/use-consumers";
import { useImportConsumersModal } from "../../hooks/use-import-consumers-modal";

const CONSUMER_COLUMNS: ExpectedColumn[] = [
  {
    field: "employeeId",
    required: true,
    description: "Employee ID",
  },
  {
    field: "nationalIdNumber",
    required: true,
    description: "National ID number",
  },
  {
    field: "tin",
    required: true,
    description: "TIN number",
  },
  {
    field: "bankAccountNumber",
    required: true,
    description: "Bank account number",
  },
  {
    field: "mobileNumber",
    required: true,
    description: "Mobile phone number",
  },
  {
    field: "fullLegalName",
    required: true,
    description: "Full legal name",
  },
  {
    field: "jobTitle",
    required: true,
    description: "Job title",
  },
  {
    field: "department",
    required: true,
    description: "Department",
  },
  {
    field: "employmentType",
    required: true,
    description: "Employment type (PERMANENT, CONTRACT, TEMPORARY)",
  },
  {
    field: "employmentStartDate",
    required: true,
    description: "Employment start date (YYYY-MM-DD)",
  },
  {
    field: "employmentStatus",
    required: true,
    description: "Employment status (ACTIVE, INACTIVE, TERMINATED)",
  },
  {
    field: "institutionId",
    required: true,
    description: "Institution ID",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "supervisorName",
    required: true,
    description: "Supervisor name",
  },
  {
    field: "workEmail",
    required: true,
    description: "Work email address",
    validator: validateEmail,
  },
  {
    field: "grossSalary",
    required: true,
    description: "Gross salary",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "netSalary",
    required: true,
    description: "Net salary",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "pensionDeduction",
    required: true,
    description: "Pension deduction amount",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "incomeTaxDeduction",
    required: true,
    description: "Income tax deduction amount",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "otherDeductions",
    required: true,
    description: "Other deductions amount",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "salaryFrequency",
    required: true,
    description: "Salary frequency (MONTHLY, WEEKLY, BIWEEKLY)",
  },
  {
    field: "payCycleTiming",
    required: true,
    description: "Pay cycle timing",
  },
  {
    field: "salaryDeductionConsent",
    required: true,
    description: "Salary deduction consent (true/false)",
    validator: validateBoolean,
    transformer: transformBoolean,
  },
  {
    field: "terminationRepaymentConsent",
    required: true,
    description: "Termination repayment consent (true/false)",
    validator: validateBoolean,
    transformer: transformBoolean,
  },
  {
    field: "maritalStatus",
    required: true,
    description: "Marital status (SINGLE, MARRIED, DIVORCED, WIDOWED)",
  },
  {
    field: "numberOfDependents",
    required: true,
    description: "Number of dependents",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "emergencyContactName",
    required: true,
    description: "Emergency contact name",
  },
  {
    field: "emergencyContactRelationship",
    required: true,
    description: "Emergency contact relationship",
  },
  {
    field: "emergencyContactPhone",
    required: true,
    description: "Emergency contact phone",
  },
  {
    field: "emergencyContactAddress",
    required: true,
    description: "Emergency contact address",
  },
  {
    field: "onboardingStatus",
    required: true,
    description: "Onboarding status (PENDING, APPROVED, REJECTED)",
  },
];

const TEMPLATE_DATA = [
  [
    "EMP001",
    "ID123456789",
    "TIN987654321",
    "ACC123456789",
    "+251911234567",
    "Melaku Tesfaye Consumer",
    "Software Engineer",
    "IT Department",
    "PERMANENT",
    "2023-01-15",
    "ACTIVE",
    "1",
    "Jane Manager",
    "Melaku Tesfaye@company.com",
    "50000",
    "42000",
    "5000",
    "2000",
    "1000",
    "MONTHLY",
    "End of month",
    "true",
    "true",
    "SINGLE",
    "0",
    "Mary Doe",
    "Sister",
    "+251911987654",
    "123 Emergency St, Addis Ababa",
    "PENDING",
  ],
];

const convertRowToConsumer = (
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
    employeeId: getFieldValue("employeeId")?.toString() || "",
    nationalIdNumber: getFieldValue("nationalIdNumber")?.toString() || "",
    tin: getFieldValue("tin")?.toString() || "",
    bankAccountNumber: getFieldValue("bankAccountNumber")?.toString() || "",
    mobileNumber: getFieldValue("mobileNumber")?.toString() || "",
    fullLegalName: getFieldValue("fullLegalName")?.toString() || "",
    jobTitle: getFieldValue("jobTitle")?.toString() || "",
    department: getFieldValue("department")?.toString() || "",
    employmentType: getFieldValue("employmentType")?.toString() || "PERMANENT",
    employmentStartDate: getFieldValue("employmentStartDate")?.toString() || "",
    employmentStatus: getFieldValue("employmentStatus")?.toString() || "ACTIVE",
    institutionId: Number(getFieldValue("institutionId")) || 1,
    supervisorName: getFieldValue("supervisorName")?.toString() || "",
    workEmail: getFieldValue("workEmail")?.toString() || "",
    grossSalary: Number(getFieldValue("grossSalary")) || 0,
    netSalary: Number(getFieldValue("netSalary")) || 0,
    pensionDeduction: Number(getFieldValue("pensionDeduction")) || 0,
    incomeTaxDeduction: Number(getFieldValue("incomeTaxDeduction")) || 0,
    otherDeductions: Number(getFieldValue("otherDeductions")) || 0,
    salaryFrequency: getFieldValue("salaryFrequency")?.toString() || "MONTHLY",
    payCycleTiming: getFieldValue("payCycleTiming")?.toString() || "",
    salaryDeductionConsent: getBooleanValue("salaryDeductionConsent"),
    terminationRepaymentConsent: getBooleanValue("terminationRepaymentConsent"),
    maritalStatus: getFieldValue("maritalStatus")?.toString() || "SINGLE",
    numberOfDependents: Number(getFieldValue("numberOfDependents")) || 0,
    emergencyContactName: getFieldValue("emergencyContactName")?.toString() || "",
    emergencyContactRelationship: getFieldValue("emergencyContactRelationship")?.toString() || "",
    emergencyContactPhone: getFieldValue("emergencyContactPhone")?.toString() || "",
    emergencyContactAddress: getFieldValue("emergencyContactAddress")?.toString() || "",
    onboardingStatus: getFieldValue("onboardingStatus")?.toString() || "PENDING",
  };
};

export const ImportConsumersModal = () => {
  const { isOpen, onClose } = useImportConsumersModal();
  const { handleAddConsumer } = useConsumers();

  const handleBulkSubmit = async (consumers: any[]) => {
    for (const consumer of consumers) {
      await handleAddConsumer(consumer);
    }
  };

  return (
    <GenericImportModal<any>
      isOpen={isOpen}
      onClose={onClose}
      entityName="Consumer"
      expectedColumns={CONSUMER_COLUMNS}
      rowToEntity={convertRowToConsumer}
      onSubmit={handleBulkSubmit}
      templateData={TEMPLATE_DATA}
    />
  );
};
