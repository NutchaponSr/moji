import { formatDistanceToNow } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { InviteCode } from "@/modules/invitations/ui/components/invite-code";
import { InviteLink } from "@/modules/invitations/ui/components/invite-link";
import { InviteRole } from "@/modules/invitations/ui/components/invite-role";

import { InvitationWithoutOrganization } from "@/modules/invitations/types";

export const invitationColumns: ColumnDef<InvitationWithoutOrganization>[] = [
  {
    id: "link",
    header: () => (
      <div className="text-xs leading-4 text-tertiary whitespace-nowrap overflow-hidden text-ellipsis">
        Link
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-2">
        <InviteLink invitationId={row.original.id} />
        <div className="py-0.5 px-1.5 text-marine bg-marine/10 text-[9px] leading-none uppercase tracking-wide whitespace-nowrap font-semibold rounded w-fit select-none">
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
      <div className="text-xs leading-4 text-tertiary whitespace-nowrap overflow-hidden text-ellipsis">
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
      <div className="text-xs leading-4 text-tertiary whitespace-nowrap overflow-hidden text-ellipsis">
        Created at
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-tertiary text-xs">
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