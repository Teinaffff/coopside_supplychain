import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    validateBoolean,
    validateEmail,
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
    description: "Institution address",
  },
  {
    field: "institutionType",
    required: false,
    description: "Type of institution",
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
    "Institution ABC",
    "institution.abc@example.com",
    "+1234567890",
    "123 Institution St, City, State",
    "Government",
    "true",
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

  const isActiveValue = getFieldValue("isActive");
  let isActive = true;
  if (isActiveValue !== undefined) {
    const val = isActiveValue.toString().toLowerCase();
    isActive = ["true", "1", "yes"].includes(val);
  }

  return {
    fullLegalName: getFieldValue("fullLegalName")?.toString() || "",
    email: getFieldValue("email")?.toString() || "",
    phoneNumber: getFieldValue("phoneNumber")?.toString() || "",
    address: getFieldValue("address")?.toString() || "",
    institutionType: getFieldValue("institutionType")?.toString() || "",
    isActive,
  };
};

export const ImportInstitutionsModal = () => {
  const { isOpen, onClose } = useImportInstitutionsModal();
  const { handleAddInstitution } = useInstitutions(); // Assuming this method exists

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
