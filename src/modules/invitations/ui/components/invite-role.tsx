"use client";

import { role } from "@/db/schema";

import { useTRPC } from "@/trpc/client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {  MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  invitationId: string;
  organizationId: string;
  role: typeof role.enumValues[number];
}

export const InviteRole = ({ 
  invitationId, 
  organizationId,
  role 
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const changeRole = useMutation(trpc.invitations.role.mutationOptions());
  const deleteLink = useMutation(trpc.invitations.delete.mutationOptions());

  const [roleBase, setRoleBase] = useState(role);

  const onChange = () => {
    changeRole.mutate({ 
      role: roleBase,
      invitationId
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.organizations.current.queryOptions({ organizationId }));
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Role
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-60">
            <DropdownMenuItem 
              onClick={() => {
                setRoleBase("admin");
                setTimeout(() => onChange(), 50);
              }}
              className="flex flex-col items-start gap-0 leading-[120%] text-sm"
            >
              <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">Admin</p>
              <p className="text-xs">
                Can create and edit workspaces and invite new members to organization
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                setRoleBase("member");
                setTimeout(() => onChange(), 50);
              }}
              className="flex flex-col items-start gap-0 leading-[120%] text-sm"
            >
              <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">Member</p>
              <p className="text-xs">
                Only can do form that be admited
              </p>
            </DropdownMenuItem>
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