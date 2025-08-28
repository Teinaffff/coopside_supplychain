import { z } from "zod";

export const sellerFormSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, "Username is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  agentType: z.string().default("SHEMACH"),
  idNumber: z.string().min(1, "ID number is required"),
  commissionRate: z.number().min(0, "Commission rate must be positive"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  isActive: z.boolean().default(true),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  taxIdentificationNumber: z
    .string()
    .min(1, "Tax identification number is required"),
  profilePictureUrl: z.string().optional().nullable(),
});

export type SellerFormValues = z.infer<typeof sellerFormSchema>;
