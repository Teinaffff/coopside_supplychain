import { z } from "zod";

export const institutionFormSchema = z.object({
  institutionId: z.number().optional(), 
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  institutionType: z.string().min(1, { message: "Institution type is required" }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  city: z.string().min(1, { message: "City is required" }),
  subcity: z.string().min(1, { message: "Subcity is required" }),
  woreda: z.string().min(1, { message: "Woreda is required" }),
  establishedDate: z.string().min(1, { message: "Established date is required" }),
  institutionStatus: z.string().min(1, { message: "Institution status is required" }),
  logo: z.any().optional().refine((data) => !data || data instanceof File, {
    message: "Logo must be a valid file",
  }),
});

export type InstitutionFormValues = z.infer<typeof institutionFormSchema>;