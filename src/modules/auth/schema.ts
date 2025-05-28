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
})

export type SignIn = z.infer<typeof signIn>;
export type SignUp = z.infer<typeof signUp>;
