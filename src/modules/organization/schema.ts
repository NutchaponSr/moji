import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters" })
    .max(100, { message: "Organization name must be less than 100 characters" }),
  slug: z.string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" }),
  image: z.string().nullable(),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;