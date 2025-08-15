import { z } from "zod";

export const pcMembersFormSchema = z.object({
  memberId: z.number().optional(), // Optional field
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  age: z.number().min(1, { message: "Age is required" }),
  city: z.string().min(1, { message: "City is required" }),
  subcity: z.string().min(1, { message: "Subcity is required" }),
  woreda: z.string().min(1, { message: "Woreda is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  photo: z.any().refine((data) => data instanceof File, {
    message: "Photo must be a valid URL",
  }),
  registrationFee: z
    .number()
    .min(1, { message: "Registration fee must be a non-negative number" }),
  share: z.number().min(1, { message: "Share must be a non-negative number" }),
  collateral: z.string().min(1, { message: "Collateral is required" }),
  inheritor: z.string().min(1, { message: "Inheritor is required" }),
});

export type PcMembersFormValues = z.infer<typeof pcMembersFormSchema>;
