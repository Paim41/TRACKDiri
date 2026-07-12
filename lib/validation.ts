import { z } from "zod";
import { isStrongPassword } from "@/lib/password-strength";

export const emailSchema = z.string().trim().email("Please enter a valid email address.").toLowerCase();

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Full name is required.").max(120),
    email: emailSchema,
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the Terms and Privacy Policy." })
    })
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match."
      });
    }
    if (!isStrongPassword(value.password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must include uppercase, lowercase, number and special character."
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
  remember: z.boolean().optional().default(false)
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(32),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match." });
    }
    if (!isStrongPassword(value.password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must include uppercase, lowercase, number and special character."
      });
    }
  });

export const waterEntrySchema = z.object({
  amountMl: z.coerce.number().int().min(50).max(3000),
  consumedAt: z.string().datetime().optional(),
  timezone: z.string().min(1).max(80),
  clientMutationId: z.string().uuid()
});

export const waterSettingsSchema = z.object({
  dailyGlassTarget: z.coerce.number().int().min(1).max(24),
  glassSizeMl: z.coerce.number().int().min(50).max(1000),
  dailyTargetMl: z.coerce.number().int().min(250).max(10000),
  reminderStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  reminderEndTime: z.string().regex(/^\d{2}:\d{2}$/),
  reminderInterval: z.coerce.number().int().min(15).max(480),
  weekendEnabled: z.boolean(),
  finalReminderEnabled: z.boolean()
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.record(z.string()),
  deviceLabel: z.string().max(120).optional()
});
