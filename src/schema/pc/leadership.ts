import { z } from "zod";

export const pcLeadershipFormSchema = z.object({
  _id: z.number().optional(),
  userId: z.number(),
  role: z.string().min(1, { message: "Role is required" }),
  board: z.string().min(1, { message: "Board is required" }),
  date: z.string().min(1, { message: "Start date is required" }),
});

export type PcLeadershipFormValues = z.infer<typeof pcLeadershipFormSchema>;
