import { z } from "zod";
import { emailRegex, phoneRegex } from "../../lib/utils";

export const adminFormSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .refine(
      (data) => {
        return phoneRegex.test(data);
      },
      { message: "Invalid phone number" }
    ),
  email: z.string(),
  // idNumber: z.object({
  //   type: z.string().min(1, { message: "ID number type is required" }),
  //   value: z.string().min(1, { message: "ID number is required" }),
  // }),
  address: z.object({
    city: z.string().min(1, { message: "City is required" }),
    subcity: z.string().min(1, { message: "Subcity is required" }),
    woreda: z.string().min(1, { message: "Woreda is required" }),
  }),
});

export const pcFormSchema = z.object({
  pcName: z.string().min(1, { message: "Full name is required" }),
  pcPhone: z
    .string()
    .min(1, { message: "Phone is required" })
    .refine(
      (data) => {
        return phoneRegex.test(data);
      },
      { message: "Invalid phone number" }
    ),
  pcEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .refine(
      (data) => {
        return emailRegex.test(data);
      },
      { message: "Invalid email address" }
    ),
  licenseNo: z.string().optional(),
  tinNo: z.string().min(1, { message: "TIN number is required" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
  accNo: z.string().optional(),
  pcAddress: z.object({
    city: z.string().min(1, { message: "City is required" }),
    subcity: z.string().min(1, { message: "Subcity is required" }),
    woreda: z.string().min(1, { message: "Woreda is required" }),
  }),
});

export type AdminFormValues = z.infer<typeof adminFormSchema>;
export type PcFormValues = z.infer<typeof pcFormSchema>;
