"use client";

import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { role } from "@/db/schema";

import { useTRPC } from "@/trpc/client";

import { ROLE_OPTIONS } from "@/types/role";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuPortal, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  invitationId: string;
  organizationId: string;
  role: typeof role.enumValues[number];
}

export const InviteRole = ({ 
  invitationId, 
  organizationId,
  role: initialRole 
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const changeRole = useMutation(trpc.invitations.role.mutationOptions());
  const deleteLink = useMutation(trpc.invitations.delete.mutationOptions());

  const [roleBase, setRoleBase] = useState(initialRole);

  const handleRoleChange = (newRole: typeof role.enumValues[number]) => {
    setRoleBase(newRole);
    setTimeout(() => {
      changeRole.mutate({ 
        invitationId,
        role: newRole,
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.organizations.current.queryOptions({ organizationId }));
        },
      });
    }, 50);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Role
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-60">
            {ROLE_OPTIONS.map((role) => (
              <DropdownMenuItem 
                key={role.value}
                onClick={() => handleRoleChange(role.value)}
                className="h-auto hover:bg-accent"
              >
                <div className="flex items-center gap-2 leading-[120%] select-none min-h-7 w-full text-sm">
                  <div className="flex-1">
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {role.label}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground break-words">
                      {role.description}
                    </div>
                  </div>
                  {roleBase === role.value && <Icon icon="game-icons:check-mark" className="ml-auto self-start size-3" />}
                </div>
              </DropdownMenuItem>
            ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => deleteLink.mutate({ invitationId }, { onSuccess: () => queryClient.invalidateQueries(trpc.organizations.current.queryOptions({ organizationId })) })} variant="destructive">
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}