import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    transformNumeric,
    validateBoolean,
    validateEmail,
    validateNumeric,
} from "../../../../lib/validation-utils";
import { AgentFormValues } from "../../../../schema/admin/agent";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useAgents } from "../../hooks/use-agents";
import { useImportAgentsModal } from "../../hooks/use-import-agents-modal";

const AGENT_COLUMNS: ExpectedColumn[] = [
  {
    field: "username",
    required: true,
    description: "Unique username for the agent",
  },
  {
    field: "fullName",
    required: true,
    description: "Full name of the agent",
  },
  {
    field: "email",
    required: true,
    description: "Valid email address",
    validator: validateEmail,
  },
  {
    field: "phoneNumber",
    required: false,
    description: "Contact phone number",
  },
  {
    field: "agentType",
    required: false,
    description: "Type of agent",
  },
  {
    field: "idNumber",
    required: false,
    description: "ID number",
  },
  {
    field: "commissionRate",
    required: false,
    description: "Commission rate (number)",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "street",
    required: false,
    description: "Street address",
  },
  {
    field: "city",
    required: false,
    description: "City",
  },
  {
    field: "state",
    required: false,
    description: "State/Province",
  },
  {
    field: "postalCode",
    required: false,
    description: "Postal/ZIP code",
  },
  {
    field: "country",
    required: false,
    description: "Country",
  },
  {
    field: "bankAccountNumber",
    required: false,
    description: "Bank account number",
  },
  {
    field: "taxIdentificationNumber",
    required: false,
    description: "Tax ID number",
  },
  {
    field: "isActive",
    required: false,
    description: "Active status (true/false)",
    validator: validateBoolean,
    transformer: transformBoolean,
  },
];

const TEMPLATE_DATA = [
  [
    "john_doe",
    "John Doe",
    "john.doe@example.com",
    "+1234567890",
    "Sales Agent",
    "ID123456",
    "5.5",
    "123 Main St",
    "New York",
    "NY",
    "10001",
    "USA",
    "ACC123456789",
    "TAX123456",
    "true",
  ],
  [
    "jane_smith",
    "Jane Smith",
    "jane.smith@example.com",
    "+1987654321",
    "Marketing Agent",
    "ID789012",
    "6.0",
    "456 Oak Ave",
    "Los Angeles",
    "CA",
    "90210",
    "USA",
    "ACC987654321",
    "TAX789012",
    "true",
  ],
];

const convertRowToAgent = (
  row: any,
  columnMapping: Record<string, string>
): AgentFormValues => {
  const getFieldValue = (fieldName: string) => {
    const mappedColumn = columnMapping[fieldName];
    return mappedColumn ? row[mappedColumn] : undefined;
  };

  const isActiveValue = getFieldValue("isActive");
  let isActive = true;
  if (isActiveValue !== undefined) {
    const val = isActiveValue.toString().toLowerCase();
    isActive = ["true", "1", "yes"].includes(val);
  }

  return {
    username: getFieldValue("username")?.toString() || "",
    fullName: getFieldValue("fullName")?.toString() || "",
    email: getFieldValue("email")?.toString() || "",
    phoneNumber: getFieldValue("phoneNumber")?.toString() || "",
    agentType: getFieldValue("agentType")?.toString() || "",
    idNumber: getFieldValue("idNumber")?.toString() || "",
    commissionRate: Number(getFieldValue("commissionRate")) || 0,
    address: {
      street: getFieldValue("street")?.toString() || "",
      city: getFieldValue("city")?.toString() || "",
      state: getFieldValue("state")?.toString() || "",
      postalCode: getFieldValue("postalCode")?.toString() || "",
      country: getFieldValue("country")?.toString() || "",
    },
    isActive,
    bankAccountNumber: getFieldValue("bankAccountNumber")?.toString() || "",
    taxIdentificationNumber:
      getFieldValue("taxIdentificationNumber")?.toString() || "",
    profilePictureUrl: undefined,
  };
};

export const ImportAgentsModal = () => {
  const { isOpen, onClose } = useImportAgentsModal();
  const { handleAddAgent } = useAgents();

  const handleBulkSubmit = async (agents: AgentFormValues[]) => {
    // Process agents one by one (or implement bulk API)
    for (const agent of agents) {
      await handleAddAgent(agent);
    }
  };

  return (
    <GenericImportModal<AgentFormValues>
      isOpen={isOpen}
      onClose={onClose}
      entityName="Agent"
      expectedColumns={AGENT_COLUMNS}
      rowToEntity={convertRowToAgent}
      onSubmit={handleBulkSubmit}
      templateData={TEMPLATE_DATA}
    />
  );
};
