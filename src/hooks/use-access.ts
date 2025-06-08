import { useSuspenseQuery } from "@tanstack/react-query";

import { role } from "@/db/schema";

import { access } from "@/types/access";

import { useTRPC } from "@/trpc/client";

export const useAccess = () => {
  const trpc = useTRPC();
  const { data: member } = useSuspenseQuery(trpc.members.getOne.queryOptions());

  const canAction = (action: keyof typeof access[typeof role.enumValues[number]]) => {
    if (!member) return false;
    return access[member.role][action];
  };

  const canView = () => canAction("canView");
  const canPerformAction = () => canAction("canAction");

  return {
    canView,
    canPerformAction,
    role: member.role,
  };
}; 