"use client";

import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";

import { Banner } from "@/modules/layouts/ui/components/banner";
import { Toolbar } from "@/modules/layouts/ui/components/toolbar";
import { columns } from "@/modules/groups/ui/components/group-columns";

import { LayoutsProvider } from "@/modules/layouts/ui/providers/layouts-provider";

import { group } from "@/modules/layouts/constants";

import { useTable } from "@/modules/layouts/hooks/use-table";
import { useGroupQuery } from "@/modules/groups/hooks/use-group-query";
import { SelectMenu } from "@/modules/layouts/ui/components/select-menu";


interface Props {
  organizationId: string;
}

export const GroupsView = ({ organizationId }: Props) => {
  const trpc = useTRPC();
 
  const [query, setQuery] = useGroupQuery();

  const [isMounted, setIsMounted] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data } = useSuspenseQuery(
    trpc.groups.getByYear.queryOptions({
      organizationId,
      year: query.year,
    }),
  );

  const {
    table,
    globalFilter,
    filterData,
    handleSearchChange,
    handleClear
  } = useTable({
    data,
    columns,  
    initialColumnVisibility: { year: false },
  });

  if (!isMounted) return <div>Loading</div>

  return (
    <div className="flex flex-col grow relative overflow-auto">
      <Banner workspace={group} />

      <Tabs defaultValue={query.year}>
        <div className="px-24 min-h-9 sticky left-0 shrink-0 x-86 w-full">
          <Toolbar  
            table={table}
            value={globalFilter}
            onChange={handleSearchChange}
            onClear={handleClear}
            tabLists={years.map((year) => ({
              value: year,
              onChange: () => setQuery({ year }),
            }))}
          />
          <SelectMenu table={table} />
        </div>
        <TabsContent value={query.year}>
          <section className="grow shrink-0 flex flex-col relative">
            <LayoutsProvider 
              filterData={filterData}
              table={table} 
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}