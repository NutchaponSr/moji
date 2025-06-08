import { role } from "@/db/schema";

export interface AccessConfig {
  canAction: boolean;
  canView: boolean;
}

export const access: Record<typeof role.enumValues[number], AccessConfig> = {
  admin: {
    canAction: true,
    canView: true,
  },
  member: {
    canAction: false,
    canView: false,
  },
  guest: {
    canAction: false,
    canView: false,
  },
}