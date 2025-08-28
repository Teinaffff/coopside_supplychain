import { ExpectedColumn } from "../../../../constants/general";
import {
  transformBoolean,
  transformNumeric,
  validateBoolean,
  validateEmail,
  validateNumeric,
} from "../../../../lib/validation-utils";
import { SellerFormValues } from "../../../../schema/admin/seller";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useImportSellersModal } from "../../hooks/use-import-sellers-modal";
import { useSellers } from "../../hooks/use-sellers";

const SELLER_COLUMNS: ExpectedColumn[] = [
  {
    field: "username",
    required: true,
    description: "Unique username for the seller",
  },
  {
    field: "fullName",
    required: true,
    description: "Full name of the seller",
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
    description: "Type of agent (defaults to SHEMACH)",
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
    description: "State",
  },
  {
    field: "postalCode",
    required: false,
    description: "Postal code",
  },
  {
    field: "country",
    required: false,
    description: "Country",
  },
  {
    field: "isActive",
    required: false,
    description: "Active status (true/false)",
    validator: validateBoolean,
    transformer: transformBoolean,
  },
  {
    field: "bankAccountNumber",
    required: false,
    description: "Bank account number",
  },
  {
    field: "taxIdentificationNumber",
    required: false,
    description: "Tax identification number",
  },
];

const TEMPLATE_DATA = [
  [
    "seller1",
    "John Doe",
    "john.doe@example.com",
    "+1234567890",
    "SHEMACH",
    "ID123456",
    "5.5",
    "123 Main St",
    "Addis Ababa",
    "Addis Ababa",
    "1000",
    "Ethiopia",
    "true",
    "1234567890",
    "TIN123456",
  ],
  [
    "seller2",
    "Jane Smith",
    "jane.smith@example.com",
    "+1987654321",
    "SHEMACH",
    "ID789012",
    "6.0",
    "456 Oak Ave",
    "Dire Dawa",
    "Dire Dawa",
    "2000",
    "Ethiopia",
    "true",
    "0987654321",
    "TIN789012",
  ],
];

const convertRowToSeller = (
  row: any,
  columnMapping: Record<string, string>
): SellerFormValues => {
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
    agentType: "SHEMACH",
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

export const ImportSellersModal = () => {
  const { isOpen, onClose } = useImportSellersModal();
  const { handleAddSeller } = useSellers();

  const handleBulkSubmit = async (sellers: SellerFormValues[]) => {
    for (const seller of sellers) {
      await handleAddSeller(seller);
    }
  };

  return (
    <GenericImportModal<SellerFormValues>
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
