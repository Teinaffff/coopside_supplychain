import { z } from "zod";

export const agentFormSchema = z.object({
  agentId: z.number().optional(), // Optional field for editing
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  age: z.number().min(1, { message: "Age is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  city: z.string().min(1, { message: "City is required" }),
  subcity: z.string().min(1, { message: "Subcity is required" }),
  woreda: z.string().min(1, { message: "Woreda is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  agentStatus: z.string().min(1, { message: "Agent status is required" }),
  photo: z.any().refine((data) => data instanceof File, {
    message: "Photo must be a valid file",
  }),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;