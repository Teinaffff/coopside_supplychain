import { z } from "zod";

export const consumerFormSchema = z.object({
  consumerId: z.number().optional(), // Optional field for editing
  institutionId: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  age: z.number().min(1, { message: "Age is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  city: z.string().min(1, { message: "City is required" }),
  subcity: z.string().min(1, { message: "Subcity is required" }),
  woreda: z.string().min(1, { message: "Woreda is required" }),
  registrationDate: z.string().min(1, { message: "Registration date is required" }),
  consumerStatus: z.string().min(1, { message: "Consumer status is required" }),
  photo: z.any().optional().refine((data) => !data || data instanceof File, {
    message: "Photo must be a valid file",
  }),
});

export type ConsumerFormValues = z.infer<typeof consumerFormSchema>;