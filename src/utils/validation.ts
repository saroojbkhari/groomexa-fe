import { z } from "zod";

/**
 * zod validation for the forms (fast feedback before calling the API).
 * Mirrors the backend's rules in groomexa-be/src/modules/auth/auth.schemas.ts; the API validates everything again.
 */

export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 72; // bcrypt ignores everything after the 72nd byte
export const PASSWORD_HINT = `At least ${PASSWORD_MIN} characters. Avoid common passwords.`;

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .pipe(z.email("Enter a valid email, like name@salon.com."));

const newPassword = z
  .string()
  .min(1, "Enter a password.")
  .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`)
  .max(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters.`);

const required = (what: string, max: number) =>
  z.string().trim().min(1, `Enter ${what}.`).max(max, `Use ${max} characters or fewer.`);

/** Required on sign-up (the API accepts it as optional). International (E.164) format, like the backend expects. */
const phone = z
  .string()
  .trim()
  .min(1, "Enter your phone number.")
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +923001234567.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

/** Field names match the API's RegisterRequest so server-side field errors map straight onto the form. */
export const signupSchema = z.object({
  salonName: required("your salon's name", 120),
  ownerName: required("your name", 100),
  email,
  phone,
  password: newPassword,
  terms: z.boolean().refine((v) => v, "Please accept the terms to continue."),
});

export const forgotSchema = z.object({ email });

export const resendVerificationSchema = z.object({ email });

export const resetSchema = z
  .object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match.", path: ["confirm"] });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotValues = z.infer<typeof forgotSchema>;
export type ResendVerificationValues = z.infer<typeof resendVerificationSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
