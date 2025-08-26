import { z } from "zod";
import { AdminModuleType } from "../../constants/interface/admin/user";

export const userFormSchema = z.object({
  id: z.number().optional(), // Optional field for editing
  username: z.string().min(1, { message: "Username is required" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  userType: z.nativeEnum(AdminModuleType, { message: "User type is required" }),
  assignedOrganization: z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum(['AGENT', 'SELLER', 'INSTITUTION', 'MANUFACTURER'])
  }).optional(),
  isActive: z.boolean().default(true),
  profilePictureUrl: z.any().optional().refine((data) => !data || data instanceof File, {
    message: "Profile picture must be a valid file",
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;