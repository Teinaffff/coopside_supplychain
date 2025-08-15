import { z } from "zod";

export const manufacturerFormSchema = z.object({
  manufacturerId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  businessType: z.string().min(1, "Business type is required"),
  city: z.string().min(1, "City is required"),
  subcity: z.string().min(1, "Subcity is required"),
  woreda: z.string().min(1, "Woreda is required"),
  establishedDate: z.string().min(1, "Established date is required"),
  manufacturerStatus: z.string().min(1, "Status is required"),
  logo: z.instanceof(File).optional(),
  logoUrl: z.string().optional(),
});

export type ManufacturerFormValues = z.infer<typeof manufacturerFormSchema>;