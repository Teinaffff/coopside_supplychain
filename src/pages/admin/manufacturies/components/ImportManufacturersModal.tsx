import { ExpectedColumn } from "../../../../constants/general";
import {
    transformNumeric,
    validateEmail,
    validateNumeric
} from "../../../../lib/validation-utils";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useImportManufacturersModal } from "../../hooks/use-import-manufacturers-modal";
import { useManufacturers } from "../../hooks/use-manufacturers";

const MANUFACTURER_COLUMNS: ExpectedColumn[] = [
  {
    field: "factoryName",
    required: true,
    description: "Name of the factory",
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
    description: "Factory address",
  },
  {
    field: "registrationNumber",
    required: false,
    description: "Factory registration number",
  },
  {
    field: "capacity",
    required: false,
    description: "Production capacity",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
];

const TEMPLATE_DATA = [
  [
    "Factory ABC",
    "factory.abc@example.com",
    "+1234567890",
    "123 Industrial St, City, State",
    "FAC123456",
    "1000",
  ],
];

const convertRowToManufacturer = (
  row: any,
  columnMapping: Record<string, string>
): any => {
  const getFieldValue = (fieldName: string) => {
    const mappedColumn = columnMapping[fieldName];
    return mappedColumn ? row[mappedColumn] : undefined;
  };

  return {
    factoryName: getFieldValue("factoryName")?.toString() || "",
    email: getFieldValue("email")?.toString() || "",
    phoneNumber: getFieldValue("phoneNumber")?.toString() || "",
    address: getFieldValue("address")?.toString() || "",
    registrationNumber: getFieldValue("registrationNumber")?.toString() || "",
    capacity: Number(getFieldValue("capacity")) || 0,
  };
};

export const ImportManufacturersModal = () => {
  const { isOpen, onClose } = useImportManufacturersModal();
  const { handleAddManufacturer } = useManufacturers(); // Assuming this method exists

  const handleBulkSubmit = async (manufacturers: any[]) => {
    for (const manufacturer of manufacturers) {
      await handleAddManufacturer(manufacturer);
    }
  };

  return (
    <GenericImportModal<any>
      isOpen={isOpen}
      onClose={onClose}
      entityName="Manufacturer"
      expectedColumns={MANUFACTURER_COLUMNS}
      rowToEntity={convertRowToManufacturer}
      onSubmit={handleBulkSubmit}
      templateData={TEMPLATE_DATA}
    />
  );
};
