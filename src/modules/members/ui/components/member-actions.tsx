"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

import { useTRPC } from "@/trpc/client";

import { useAccess } from "@/hooks/use-access";
import { useConfirm } from "@/hooks/use-confirm";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  organizationId: string;
}

export const MemberActions = ({ ...props }: Props) => {
  const { canPerformAction } = useAccess();
  const { data: session } = authClient.useSession();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "You are removing this member from your organization",
    description: "We'd love your input to make Notion better"
  });


  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const leave = useMutation(trpc.members.delete.mutationOptions());

  const onLeave = async () => {
    const ok = await confirm();

    if (ok) {
      leave.mutate({ ...props }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.organizations.current.queryOptions({ organizationId: props.organizationId }));
        }
      });
    }
  }
  
  if (!canPerformAction()) return null;

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={onLeave} 
            variant="destructive" 
          >
            {session?.user.id === props.userId
              ? "Leave from organization"
              : "Remove from organization"
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}