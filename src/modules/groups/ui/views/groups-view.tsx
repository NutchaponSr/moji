"use client";

import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";

import { Banner } from "@/modules/layouts/ui/components/banner";
import { Toolbar } from "@/modules/layouts/ui/components/toolbar";
import { LayoutsProvider } from "@/modules/layouts/ui/providers/layouts-provider";

import { group } from "@/modules/layouts/constants";

import { useGroupQuery } from "@/modules/groups/hooks/use-group-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useTable } from "@/modules/layouts/hooks/use-table";
import { columns } from "../components/group-columns";

interface Props {
  organizationId: string;
}

export const GroupsView = ({ organizationId }: Props) => {
  const trpc = useTRPC();
 
  const [query] = useGroupQuery();

  const { data } = useSuspenseQuery(
    trpc.groups.getByYear.queryOptions({
      organizationId,
      year: query.year,
    }),
  );

  const {
    table
  } = useTable({
    data,
    columns
  });

  return (
    <div className="flex flex-col grow relative overflow-auto">
      <Banner workspace={group} />

      <Tabs defaultValue={new Date().getFullYear().toString()}>
        <Toolbar table={table} />
        <TabsContent value={query.year}>
          <section className="grow shrink-0 flex flex-col relative">
            <LayoutsProvider table={table} />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}