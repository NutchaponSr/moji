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
    groupedData,
    hasAllHide,
    visibilityManager,
    filterData,
    handleSearchChange,
    onDragEnd,
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
        <Toolbar  
          table={table}
          value={globalFilter}
          groupedData={groupedData}
          onChange={handleSearchChange}
          onClear={handleClear}
          onDragEnd={onDragEnd}
          hasAllHide={hasAllHide}
          visibilityManager={visibilityManager}
          tabLists={years.map((year) => ({
            value: year,
            onChange: () => setQuery({ year }),
          }))}
        />
        <TabsContent value={query.year}>
          <section className="grow shrink-0 flex flex-col relative">
            <LayoutsProvider 
              filterData={filterData}
              table={table} 
              groupedData={groupedData} 
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}