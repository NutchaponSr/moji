"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  organizationId: string;
}

export const OrganizationSwitcher = ({ organizationId }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.organizations.getMany.queryOptions());

  const currentOrganization = data.find((f) => f.organizationId === organizationId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          {currentOrganization?.organization.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <pre className="text-xs">
          {JSON.stringify(currentOrganization, null, 2)}
        </pre>
      </PopoverContent>
    </Popover>
  );
}