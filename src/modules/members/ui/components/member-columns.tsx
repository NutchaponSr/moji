import { ColumnDef } from "@tanstack/react-table";

import { ImageAvatar } from "@/components/image-avatar";

import { MemberRole } from "@/modules/members/ui/components/member-role";
import { MemberActions } from "@/modules/members/ui/components/member-actions";

import { Member } from "@/modules/members/types";

export const memberColumns: ColumnDef<Member>[] = [
  {
    id: "user",
    header: () => (
      <div className="flex items-center h-full min-w-[219px]">
        <button className="transition inline-flex items-center h-5 p-[5px] rounded whitespace-nowrap text-xs shrink-0 leading-[1.2] text-primary hover:bg-primary/6">
          <span className="text-xs font-normal text-[#73726e] whitespace-nowrap text-ellipsis overflow-hidden">
            User
          </span>
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="min-w-[219px] text-sm text-primary min-h-10.5 max-h-13 flex items-center h-full"
      >
        <div className="flex items-center text-sm w-full justify-between">
          <div className="flex items-center gap-2.5 my-1">
            <div className="relative">
              <ImageAvatar 
                src={row.original.user.image || ""}
                name={row.original.user.name}
                className="rounded-full size-7"
              />
            </div>
            <div className="max-w-40">
              <div className="h-4.5 self-stretch text-sm font-medium leading-5 whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                {row.original.user.name}
              </div>
              <div className="h-4 self-stretch text-xs font-normal text-[#73726e] leading-4 whitespace-nowrap overflow-hidden text-ellipsis">
                {row.original.user.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    meta: {
      sticky: true,
      width: "219px"
    }
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="flex items-center h-full min-w-[219px]">
        <button className="transition inline-flex items-center h-5 p-[5px] rounded whitespace-nowrap text-xs shrink-0 leading-[1.2] text-primary hover:bg-primary/6">
          <span className="text-xs font-normal text-[#73726e] whitespace-nowrap text-ellipsis overflow-hidden">
            Role
          </span>
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-primary min-h-10.5 max-h-13 flex items-center h-full">
        <MemberRole 
          organizationId={row.original.organizationId}
          userId={row.original.userId}
          role={row.original.role}
        />
      </div>
    )
  },
  {
    id: "action",
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <MemberActions 
          organizationId={row.original.organizationId}
          userId={row.original.userId}
        />
      </div>
    ),
    meta: {
      width: "5%"
    }
  }
]