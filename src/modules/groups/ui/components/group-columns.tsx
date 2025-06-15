import { Icon } from "@iconify-icon/react";

import { ColumnDef } from "@tanstack/react-table";
import { Group } from "../../types";

export const columns: ColumnDef<Group>[] = [
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
    cell: ({ row }) => (
      <div className="flex overflow-x-clip h-full w-full">
        <button className="tranistion relative block text-sm overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
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
    meta: {
      width: "295px"
    }
  }
]