import { z } from "zod";

export const signIn = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signUp = signIn.extend({
  name: z.string().min(1, { message: "Name is required" }),
  confirmPassword: z.string().min(1, { message: "Password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password don't match.",
  path: ["confirmPassword"],
});

export const org = z.object({
  name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters" })
    .max(100, { message: "Organization name must be less than 100 characters" }),
  slug: z.string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" }),
  image: z.string().url({ message: "Please enter a valid image URL" }).nullable(),
});

export type SignIn = z.infer<typeof signIn>;
export type SignUp = z.infer<typeof signUp>;
export type Org = z.infer<typeof org>;
