import { Icon } from "@iconify-icon/react";
import { ColumnDef } from "@tanstack/react-table";

import { Group } from "@/modules/groups/types";
import { columnIcons } from "@/modules/layouts/constants";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { GripVerticalIcon } from "lucide-react";
import { PeekButton } from "@/modules/layouts/ui/components/peek-button";

export const columns: ColumnDef<Group>[] = [
  { 
    id: "actions",
    header: ({ table }) => (
      <div className="absolute left-0 top-0 h-full">
        <div className="sticky -left-9 flex">
          <div className="absolute -left-9">
            <Label className="h-full items-start justify-center flex cursor-pointer">
              <div className={cn(
                "size-9 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity",
                table.getIsAllRowsSelected() && "opacity-100"
              )}>
                <Checkbox 
                  checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                />
              </div>
            </Label>
          </div>
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="absolute left-0 top-0 h-full">
        <div className="sticky -left-9 flex">
          <div className="absolute -left-9">
            <Label className="h-full items-start justify-center flex cursor-pointer">
              <div className={cn(
                "size-9 flex items-center justify-center opacity-0 group-hover/row:opacity-50 hover:opacity-100 transition-opacity",
                row.getIsSelected() && "opacity-100 group-hover/row:opacity-100"
              )}>
                <Checkbox 
                  checked={row.getIsSelected()} 
                  onCheckedChange={(value) => row.toggleSelected(!!value)} 
                  aria-label="Select row"
                />
              </div>
            </Label>
          </div>
        </div>
        <div className="sticky -left-[56px] flex">
          <div className="absolute -left-[56px]">
            <div className="w-5 h-9 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
              <button className="transition flex items-center justify-center w-[18px] h-6 rounded hover:bg-accent cursor-pointer">
                <GripVerticalIcon className="size-4.5 stroke-[1.7] shrink-0 text-muted" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    enableGlobalFilter: false,
    enableColumnFilter: false,
    enableGrouping: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <button className="hover:bg-primary/4 transition flex items-center px-2 w-full h-full">
        <div className="flex items-center leading-[120%] min-w-0 text-sm flex-1">
          <span className="whitespace-nowrap text-ellipsis overflow-hidden">
            Name
          </span>
        </div>
      </button>
    ),
    cell: ({ table, row }) => (
      <div className="flex overflow-x-clip h-full w-full">
        <button className="tranistion relative block text-sm overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
          <PeekButton data={row.original} table={table} />

          <div className="flex items-center justify-start gap-1.5">
            <div className="flex shrink-0 items-center justify-center size-5">
              <Icon icon={row.original.icon!} width={18} height={18} />
            </div>
            <span className="leading-1.5 whitespace-nowrap break-words inline-flex font-medium mr-1">
              {row.getValue("name")}
            </span>
          </div>
        </button>
      </div>
    ),
    enableHiding: false,
    meta: {
      width: "295px",
      icon: columnIcons["text"],
      variant: "text"
    }
  },
  {
    accessorKey: "year",
    header: () => (
      <button className="hover:bg-primary/4 transition flex items-center px-2 w-full h-full">
        <div className="flex items-center leading-[120%] min-w-0 text-sm flex-1">
          <span className="whitespace-nowrap text-ellipsis overflow-hidden">
            Year
          </span>
        </div>
      </button>
    ),
    cell: ({ row }) => (
      <div className="flex overflow-x-clip h-full w-full">
        <button className="tranistion relative block text-sm overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
          <div className="flex items-center justify-start gap-1.5">
            <span className="leading-1.5 whitespace-nowrap break-words inline-flex font-medium mr-1">
              {row.getValue("year")}
            </span>
          </div>
        </button>
      </div>
    ),
    meta: {
      width: "128px",
      icon: columnIcons["numeric"],
      variant: "numeric"
    }
  }
]