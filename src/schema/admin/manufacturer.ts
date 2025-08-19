import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const bankAccountInfoSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  swiftCode: z.string().min(1, "Swift code is required"),
  iban: z.string().min(1, "IBAN is required"),
});

export const manufacturerFormSchema = z.object({
  id: z.number().optional(),
  factoryName: z.string().min(1, "Factory name is required"),
  factoryCode: z.string().min(1, "Factory code is required"),
  factoryType: z.string().min(1, "Factory type is required"),
  tinNumber: z.string().min(1, "TIN number is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
  headOfficeAddress: addressSchema,
  factoryAddresses: z.array(addressSchema).min(1, "At least one factory address is required"),
  gpsCoordinates: z.string().min(1, "GPS coordinates are required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  phoneNumber: z.string().min(1, "Phone number is required"),
  faxNumber: z.string().optional(),
  contactPerson: z.string().min(1, "Contact person is required"),
  alternateContactPerson: z.string().optional(),
  operatingLicenses: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  mainProducts: z.array(z.string()).min(1, "At least one main product is required"),
  productionCapacity: z.string().min(1, "Production capacity is required"),
  productionLines: z.array(z.string()).default([]),
  machineryList: z.array(z.string()).default([]),
  rawMaterialSources: z.array(z.string()).default([]),
  warehouseCapacity: z.string().min(1, "Warehouse capacity is required"),
  numberOfEmployees: z.number().min(1, "Number of employees must be at least 1"),
  hrContact: z.string().min(1, "HR contact is required"),
  suppliers: z.array(z.string()).default([]),
  distributors: z.array(z.string()).default([]),
  exportImportLicenses: z.array(z.string()).default([]),
  bankAccountInfo: bankAccountInfoSchema,
  preferredCurrency: z.string().min(1, "Preferred currency is required"),
  billingAddress: addressSchema,
  paymentTerms: z.string().min(1, "Payment terms are required"),
  erpSystem: z.string().optional(),
  apiIntegrationId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ManufacturerFormValues = z.infer<typeof manufacturerFormSchema>;