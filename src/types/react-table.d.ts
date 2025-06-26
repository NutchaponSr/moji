import "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

import { role } from "@/db/schema";
import { ColumnType } from "@/modules/layouts/types";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    role?: typeof role.enumValues[number],
    width?: string;
    sticky?: boolean;
    icon?: LucideIcon;
    variant: ColumnType;
  }

  interface ColumnSort {
    desc: boolean;
    id: string;
    type: ColumnType;
    icon?: LucideIcon;
  }
}