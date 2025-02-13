import { z } from "zod";
import { emailRegex } from "../lib/utils";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .refine((data) => emailRegex.test(data), { message: "Invalid email" }),
    name: z.string().min(1, { message: "Cooperative name is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~])/, {
        message:
          "Password must contain one lowercase letter, one uppercase letter, one number, and one special character",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
