import { z } from "zod";

/** Client-side validation for fast feedback. The API must validate everything again. */

export const PASSWORD_HINT = "At least 8 characters, with a letter and a number.";

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .pipe(z.email("Enter a valid email, like name@salon.com."));

const newPassword = z
  .string()
  .min(1, "Enter a password.")
  .refine((v) => v.length >= 8 && /[a-z]/i.test(v) && /\d/.test(v), PASSWORD_HINT);

const required = (what: string) => z.string().trim().min(1, `Enter ${what}.`);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z.object({
  salon: required("your salon's name"),
  name: required("your name"),
  email,
  password: newPassword,
  terms: z.boolean().refine((v) => v, "Please accept the terms to continue."),
});

export const forgotSchema = z.object({ email });

export const resetSchema = z
  .object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match.", path: ["confirm"] });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotValues = z.infer<typeof forgotSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
