import { ExpectedColumn } from "../../../../constants/general";
import {
    transformBoolean,
    validateBoolean,
    validateEmail,
} from "../../../../lib/validation-utils";
import { UserFormValues } from "../../../../schema/admin/user";
import { GenericImportModal } from "../../components/GenericImportModal";
import { useUsers } from "../../hooks/use-users";
import { useImportUsersModal } from "../../hooks/use-import-users-modal";
import { AdminModuleType } from "../../../../constants/interface/admin/user";

const USER_COLUMNS: ExpectedColumn[] = [
  {
    field: "username",
    required: true,
    description: "Unique username for the user",
  },
  {
    field: "fullName",
    required: true,
    description: "Full name of the user",
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
    field: "userType",
    required: true,
    description: "Type of admin user (WEB_ADMIN, AGENT_ADMIN, etc.)",
  },
  {
    field: "assignedOrganizationName",
    required: false,
    description: "Name of assigned organization (if applicable)",
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
    "Melaku Tesfaye_admin",
    "Melaku Tesfaye Admin",
    "Melaku Tesfaye.admin@example.com",
    "+1234567890",
    "WEB_ADMIN",
    "",
    "true",
  ],
  [
    "jane_agent_admin",
    "Jane Agent Admin",
    "jane.agent@example.com",
    "+1987654321",
    "AGENT_ADMIN",
    "Sample Agent Organization",
    "true",
  ],
];

const convertRowToUser = (
  row: any,
  columnMapping: Record<string, string>
): UserFormValues => {
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

  const userTypeValue = getFieldValue("userType")?.toString() || "WEB_ADMIN";
  const assignedOrgName = getFieldValue("assignedOrganizationName")?.toString();

  return {
    username: getFieldValue("username")?.toString() || "",
    fullName: getFieldValue("fullName")?.toString() || "",
    email: getFieldValue("email")?.toString() || "",
    phoneNumber: getFieldValue("phoneNumber")?.toString() || "",
    userType: userTypeValue as AdminModuleType,
    assignedOrganization: assignedOrgName ? {
      id: 1, // This would come from actual organization lookup
      name: assignedOrgName,
      type: 'AGENT' as const // This would be determined based on userType
    } : undefined,
    isActive,
    profilePictureUrl: undefined,
  };
};

export const ImportUsersModal = () => {
  const { isOpen, onClose } = useImportUsersModal();
  const { handleAddUser } = useUsers();

  const handleBulkSubmit = async (users: UserFormValues[]) => {
    // Process users one by one (or implement bulk API)
    for (const user of users) {
      await handleAddUser(user);
    }
  };

  return (
    <GenericImportModal<UserFormValues>
      isOpen={isOpen}
      onClose={onClose}
      entityName="User"
      expectedColumns={USER_COLUMNS}
      rowToEntity={convertRowToUser}
      onSubmit={handleBulkSubmit}
      templateData={TEMPLATE_DATA}
    />
  );
};