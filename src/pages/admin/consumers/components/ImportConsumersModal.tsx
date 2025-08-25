import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    validateBoolean,
    validateEmail,
} from "../../../../lib/validation-utils";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useConsumers } from "../../hooks/use-consumers";
import { useImportConsumersModal } from "../../hooks/use-import-consumers-modal";

const CONSUMER_COLUMNS: ExpectedColumn[] = [
  {
    field: "name",
    required: true,
    description: "Name of the consumer",
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
    field: "address",
    required: false,
    description: "Consumer address",
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
    "John Consumer",
    "john.consumer@example.com",
    "+1234567890",
    "123 Consumer St, City, State",
    "true",
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

  const isActiveValue = getFieldValue("isActive");
  let isActive = true;
  if (isActiveValue !== undefined) {
    const val = isActiveValue.toString().toLowerCase();
    isActive = ["true", "1", "yes"].includes(val);
  }

  return {
    name: getFieldValue("name")?.toString() || "",
    email: getFieldValue("email")?.toString() || "",
    phoneNumber: getFieldValue("phoneNumber")?.toString() || "",
    address: getFieldValue("address")?.toString() || "",
    isActive,
  };
};

export const ImportConsumersModal = () => {
  const { isOpen, onClose } = useImportConsumersModal();
  const { handleAddConsumer } = useConsumers(); // Assuming this method exists

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
