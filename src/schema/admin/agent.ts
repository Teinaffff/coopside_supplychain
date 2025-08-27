import { z } from "zod";
import { bankAccountRegex, phoneRegex } from "../../lib/utils";

export const agentFormSchema = z.object({
  id: z.number().optional(), // Optional field for editing
  username: z.string().min(1, { message: "Username is required" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine((value) => phoneRegex.test(value), {
      message: "Invalid phone number",
    }),
  agentType: z.string().min(1, { message: "Agent type is required" }),
  idNumber: z.string().min(1, { message: "ID number is required" }),
  commissionRate: z
    .number()
    .min(0, { message: "Commission rate must be positive" }),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }),
  isActive: z.boolean().default(true),
  bankAccountNumber: z
    .string()
    .min(1, { message: "Bank account number is required" })
    .refine((value) => bankAccountRegex.test(value), {
      message: "Invalid bank account number",
    }),
  taxIdentificationNumber: z
    .string()
    .min(1, { message: "Tax identification number is required" }),
  // profilePictureUrl: z
  //   .any()
  //   .optional()
  //   .refine((data) => !data || data instanceof File, {
  //     message: "Profile picture must be a valid file",
  //   }),
  profilePictureUrl: z.string().optional().nullable(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;
