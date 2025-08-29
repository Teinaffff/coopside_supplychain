interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export enum AdminModuleType {
  WEB_ADMIN = "WEB_ADMIN",
  AGENT_ADMIN = "AGENT_ADMIN",
  SELLER_ADMIN = "SELLER_ADMIN",
  INSTITUTION_ADMIN = "INSTITUTION_ADMIN",
  MANUFACTURER_ADMIN = "MANUFACTURER_ADMIN",
  CONSUMER_ADMIN = "CONSUMER_ADMIN",
  FINANCE_ADMIN = "FINANCE_ADMIN",
  INVENTORY_ADMIN = "INVENTORY_ADMIN",
  REPORT_ADMIN = "REPORT_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface BaseUser extends Timestamps {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  userType: AdminModuleType;
  isActive: boolean;
  profilePictureUrl?: string;
}

export interface OrganizationReference {
  id: number;
  name: string;
  type: "AGENT" | "SELLER" | "INSTITUTION" | "MANUFACTURER";
}

export interface AdminUser extends BaseUser {
  userType: AdminModuleType;
  assignedOrganization?: OrganizationReference;
}

export interface AdminModuleOption {
  value: AdminModuleType;
  label: string;
  requiresOrganization: boolean;
}

export const ADMIN_MODULE_OPTIONS: AdminModuleOption[] = [
  {
    value: AdminModuleType.WEB_ADMIN,
    label: "Admin",
    requiresOrganization: false,
  },
  {
    value: AdminModuleType.AGENT_ADMIN,
    label: "Agent Admin",
    requiresOrganization: true,
  },
  {
    value: AdminModuleType.SELLER_ADMIN,
    label: "Seller Admin",
    requiresOrganization: true,
  },
  {
    value: AdminModuleType.INSTITUTION_ADMIN,
    label: "Institution Admin",
    requiresOrganization: true,
  },
  {
    value: AdminModuleType.MANUFACTURER_ADMIN,
    label: "Manufacturer Admin",
    requiresOrganization: true,
  },
];
