import { role } from "@/db/schema"

type RoleOption = {
  label: string;
  description: string;
  value: typeof role.enumValues[number];
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Can create and edit workspaces and invite new members to organization"
  },
  {
    value: "member",
    label: "Member",
    description: "Only can do form that be admitted"
  },
  {
    value: "guest",
    label: "Guest",
    description: "Limited access to view only"
  }
] as const;