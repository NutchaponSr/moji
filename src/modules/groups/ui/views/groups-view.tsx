"use client";

import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";

import { Banner } from "@/modules/layouts/ui/components/banner";

import { Toolbar } from "@/modules/layouts/ui/components/toolbar";
import { LayoutsProvider } from "@/modules/layouts/ui/providers/layouts-provider";

import { group } from "@/modules/layouts/constants";
import { useGroupQuery } from "../../hooks/use-group-query";

export const GroupsView = () => {
  const [query] = useGroupQuery();

  return (
    <div className="flex flex-col grow relative overflow-auto">
      <Banner workspace={group} />

      <Tabs defaultValue={new Date().getFullYear().toString()}>
        <Toolbar />
        <TabsContent value={query.year}>
          <LayoutsProvider query={query} />
        </TabsContent>
      </Tabs>
    </div>
  );
}