import { ExpectedColumn } from "../../../../constants/general";
import {
    transformNumeric,
    validateEmail,
    validateNumeric
} from "../../../../lib/validation-utils";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useImportSellersModal } from "../../hooks/use-import-sellers-modal";
import { useSellers } from "../../hooks/use-sellers";

// Define seller columns based on seller schema
const SELLER_COLUMNS: ExpectedColumn[] = [
  {
    field: "name",
    required: true,
    description: "Name of the cooperative",
  },
  {
    field: "email",
    required: true,
    description: "Valid email address",
    validator: validateEmail,
  },
  {
    field: "phone",
    required: true,
    description: "Contact phone number",
  },
  {
    field: "chairperson",
    required: true,
    description: "Name of the chairperson",
  },
  {
    field: "memberCount",
    required: true,
    description: "Number of members",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "city",
    required: true,
    description: "City location",
  },
  {
    field: "subcity",
    required: true,
    description: "Subcity location",
  },
  {
    field: "woreda",
    required: true,
    description: "Woreda location",
  },
  {
    field: "establishedDate",
    required: true,
    description: "Date of establishment (YYYY-MM-DD)",
  },
  {
    field: "sellerStatus",
    required: true,
    description: "Current status of the seller",
  },
];

const TEMPLATE_DATA = [
  [
    "Cooperative ABC",
    "coop.abc@example.com",
    "+1234567890",
    "John Doe",
    "150",
    "Addis Ababa",
    "Bole",
    "03",
    "2020-01-15",
    "ACTIVE",
  ],
  [
    "Cooperative XYZ",
    "coop.xyz@example.com",
    "+1987654321",
    "Jane Smith",
    "200",
    "Dire Dawa",
    "Sabian",
    "02",
    "2019-05-20",
    "ACTIVE",
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

  return {
    name: getFieldValue("name")?.toString() || "",
    email: getFieldValue("email")?.toString() || "",
    phone: getFieldValue("phone")?.toString() || "",
    chairperson: getFieldValue("chairperson")?.toString() || "",
    memberCount: Number(getFieldValue("memberCount")) || 0,
    city: getFieldValue("city")?.toString() || "",
    subcity: getFieldValue("subcity")?.toString() || "",
    woreda: getFieldValue("woreda")?.toString() || "",
    establishedDate: getFieldValue("establishedDate")?.toString() || "",
    sellerStatus: getFieldValue("sellerStatus")?.toString() || "",
  };
};

export const ImportSellersModal = () => {
  const { isOpen, onClose } = useImportSellersModal();
  const { handleAddSeller } = useSellers();

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
