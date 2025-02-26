import { z } from "zod";

export const pcShareFormSchema = z.object({
  shareId: z.number().optional(),
  shareName: z.string().min(1, { message: "Name is required" }),
  pricePerShare: z.number().min(1, { message: "Share price is required" }),
  minShare: z.number().min(1, { message: "Minimum share is required" }),
  shareDividend: z.number().min(1, { message: "Share dividend is required" }),
  shareTax: z.number().min(1, { message: "Share tax is required" }),
  shareBackup: z.number().min(1, { message: "Share backup is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

export type PcShareFormValues = z.infer<typeof pcShareFormSchema>;
