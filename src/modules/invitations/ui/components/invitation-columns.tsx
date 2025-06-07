import { formatDistanceToNow } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { InviteLink } from "./invite-link";
import { InviteCode } from "./invite-code";
import { InviteRole } from "./invite-role";

import { Invitation } from "../../types";

export const columns: ColumnDef<Invitation>[] = [
  {
    id: "link",
    header: () => (
      <div className="text-xs leading-4 text-[#73726e] whitespace-nowrap overflow-hidden text-ellipsis">
        Link
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-2">
        <InviteLink invitationId={row.original.id} />
        <div className="py-0.5 px-1.5 text-[#2383e2] bg-[#2383e21a] text-[9px] leading-none uppercase tracking-wide whitespace-nowrap font-semibold rounded w-fit select-none">
          {row.original.role}
        </div>
      </div>
    ),
    meta: {
      width: "40%",
    }
  },
  {
    accessorKey: "inviteCode",
    header: () => (
      <div className="text-xs leading-4 text-[#73726e] whitespace-nowrap overflow-hidden text-ellipsis">
        Invite code
      </div>
    ),
    cell: ({ row }) => (
      <InviteCode inviteCode={row.getValue("inviteCode")} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-xs leading-4 text-[#73726e] whitespace-nowrap overflow-hidden text-ellipsis">
        Created at
      </div>
    ),
    cell: ({ row }) => (
      <span>
        {formatDistanceToNow(row.original.createdAt)}
      </span>
    )
  },
  {
    id: "action",
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <InviteRole 
          invitationId={row.original.id}
          organizationId={row.original.organizationId}
          role={row.original.role}
        />
      </div>
    ),
    meta: {
      width: "5%"
    }
  }
]