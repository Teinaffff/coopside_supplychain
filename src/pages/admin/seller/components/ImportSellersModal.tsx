import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    validateBoolean,
    validateEmail
} from "../../../../lib/validation-utils";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useImportSellersModal } from "../../hooks/use-import-sellers-modal";
import { useSellers } from "../../hooks/use-sellers";

// Define seller columns based on your seller schema
const SELLER_COLUMNS: ExpectedColumn[] = [
  {
    field: "name",
    required: true,
    description: "Name of the primary cooperative",
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
    description: "Physical address",
  },
  {
    field: "registrationNumber",
    required: false,
    description: "Registration number",
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
    "Cooperative ABC",
    "coop.abc@example.com",
    "+1234567890",
    "123 Main St, City, State",
    "REG123456",
    "true",
  ],
  [
    "Cooperative XYZ",
    "coop.xyz@example.com",
    "+1987654321",
    "456 Oak Ave, City, State",
    "REG789012",
    "true",
  ],
];

const convertRowToSeller = (
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
    registrationNumber: getFieldValue("registrationNumber")?.toString() || "",
    isActive,
  };
};

export const ImportSellersModal = () => {
  const { isOpen, onClose } = useImportSellersModal();
  const { handleAddSeller } = useSellers(); // Assuming this method exists

  const handleBulkSubmit = async (sellers: any[]) => {
    for (const seller of sellers) {
      await handleAddSeller(seller);
    }
  };

  return (
    <GenericImportModal<any>
      isOpen={isOpen}
      onClose={onClose}
      entityName="Seller"
      expectedColumns={SELLER_COLUMNS}
      rowToEntity={convertRowToSeller}
      onSubmit={handleBulkSubmit}
      templateData={TEMPLATE_DATA}
    />
  );
};
