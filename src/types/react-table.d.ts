import "@tanstack/react-table";

import { role } from "@/db/schema";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    role?: typeof role.enumValues[number],
    width?: string;
    sticky?: boolean;
  }
}