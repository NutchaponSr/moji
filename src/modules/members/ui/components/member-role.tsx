"use client";

import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { ChevronDownIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { role } from "@/db/schema";

import { useAccess } from "@/hooks/use-access";

import { useTRPC } from "@/trpc/client";

import { ROLE_OPTIONS } from "@/types/role";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Props {
  userId: string;
  organizationId: string;
  role: typeof role.enumValues[number];
}

export const MemberRole = ({ role: initialRole, ...props }: Props) => {
  const { canPerformAction } = useAccess();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [roleBase, setRoleBase] = useState(initialRole);

  const changeRole = useMutation(trpc.members.role.mutationOptions());

  const handleRoleChange = (newRole: typeof role.enumValues[number]) => {
    setRoleBase(newRole);
    setTimeout(() => {
      changeRole.mutate({ 
        ...props,
        role: newRole,
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.organizations.current.queryOptions({ 
              organizationId: props.organizationId 
            })
          );
        },
      });
    }, 50);
  };

  if (!canPerformAction()) {
    return (
      <span className="text-xs text-[#73726e] leading-4 whitespace-nowrap overflow-hidden text-ellipsis h-8 px-1 py-2">
        {roleBase}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="transition inline-flex items-center h-7 px-2 rounded-sm whitespace-nowrap text-sm leading-[1.2] text-[#73726e] max-w-[148px] hover:bg-primary/6 gap-1">
          <span className="whitespace-nowrap text-ellipsis overflow-hidden first-letter:uppercase">
            {roleBase}
          </span>
          <ChevronDownIcon className="text-[#c7c7c5] size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};