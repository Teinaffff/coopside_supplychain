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
    field: "factoryCode",
    required: true,
    description: "Unique factory code",
  },
  {
    field: "factoryType",
    required: true,
    description: "Type of factory",
  },
  {
    field: "tinNumber",
    required: true,
    description: "TIN number",
  },
  {
    field: "registrationNumber",
    required: true,
    description: "Registration number",
  },
  {
    field: "licenseNumber",
    required: true,
    description: "License number",
  },
  {
    field: "licenseExpiryDate",
    required: true,
    description: "License expiry date (YYYY-MM-DD)",
  },
  {
    field: "phoneNumber",
    required: true,
    description: "Contact phone number",
  },
  {
    field: "contactPerson",
    required: true,
    description: "Primary contact person",
  },
  {
    field: "productionCapacity",
    required: true,
    description: "Production capacity",
  },
  {
    field: "warehouseCapacity",
    required: true,
    description: "Warehouse capacity",
  },
  {
    field: "numberOfEmployees",
    required: true,
    description: "Number of employees",
    validator: validateNumeric,
    transformer: transformNumeric,
  },
  {
    field: "hrContact",
    required: true,
    description: "HR contact information",
  },
  {
    field: "preferredCurrency",
    required: true,
    description: "Preferred currency",
  },
  {
    field: "paymentTerms",
    required: true,
    description: "Payment terms",
  },
];

const TEMPLATE_DATA = [
  [
    "Factory ABC",
    "FAC001",
    "Textile",
    "TIN123456789",
    "REG123456",
    "LIC789012",
    "2025-12-31",
    "+1234567890",
    "John Manager",
    "1000 units/day",
    "5000 sqm",
    "150",
    "hr@factoryabc.com",
    "USD",
    "Net 30",
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
    factoryCode: getFieldValue("factoryCode")?.toString() || "",
    factoryType: getFieldValue("factoryType")?.toString() || "",
    tinNumber: getFieldValue("tinNumber")?.toString() || "",
    registrationNumber: getFieldValue("registrationNumber")?.toString() || "",
    licenseNumber: getFieldValue("licenseNumber")?.toString() || "",
    licenseExpiryDate: getFieldValue("licenseExpiryDate")?.toString() || "",
    phoneNumber: getFieldValue("phoneNumber")?.toString() || "",
    contactPerson: getFieldValue("contactPerson")?.toString() || "",
    productionCapacity: getFieldValue("productionCapacity")?.toString() || "",
    warehouseCapacity: getFieldValue("warehouseCapacity")?.toString() || "",
    numberOfEmployees: Number(getFieldValue("numberOfEmployees")) || 0,
    hrContact: getFieldValue("hrContact")?.toString() || "",
    preferredCurrency: getFieldValue("preferredCurrency")?.toString() || "",
    paymentTerms: getFieldValue("paymentTerms")?.toString() || "",
    // Set default values for complex nested objects
    headOfficeAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    },
    factoryAddresses: [{
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }],
    gpsCoordinates: "",
    website: "",
    faxNumber: "",
    alternateContactPerson: "",
    operatingLicenses: [],
    certifications: [],
    mainProducts: [],
    productionLines: [],
    machineryList: [],
    rawMaterialSources: [],
    suppliers: [],
    distributors: [],
    exportImportLicenses: [],
    bankAccountInfo: {
      accountNumber: "",
      accountName: "",
      bankName: "",
      branchName: "",
      swiftCode: "",
      iban: ""
    },
    billingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    },
    erpSystem: "",
    apiIntegrationId: ""
  };
};

export const ImportManufacturersModal = () => {
  const { isOpen, onClose } = useImportManufacturersModal();
  const { handleAddManufacturer } = useManufacturers();

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
