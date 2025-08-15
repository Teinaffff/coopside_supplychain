import { z } from "zod";

export const sellerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  chairperson: z.string().min(1, "Chairperson is required"),
  memberCount: z.number().min(1, "Member count must be at least 1"),
  city: z.string().min(1, "City is required"),
  subcity: z.string().min(1, "Subcity is required"),
  woreda: z.string().min(1, "Woreda is required"),
  establishedDate: z.string().min(1, "Established date is required"),
  sellerStatus: z.string().min(1, "Status is required"),
  logoUrl: z.string().optional(),
});

export type SellerFormValues = z.infer<typeof sellerFormSchema>;