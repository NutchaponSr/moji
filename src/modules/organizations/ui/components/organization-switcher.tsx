"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useToggle } from "@uidotdev/usehooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronsUpDownIcon, PlusIcon, Settings2Icon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { 
  Popover, 
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ImageAvatar } from "@/components/image-avatar";
import { CommandSearch } from "@/components/command-search";

import { OrganizationCreateSheet } from "@/modules/organizations/ui/components/organization-create-sheet";
import { useSettingsModal } from "@/store/use-settings-modal";

interface Props {
  organizationId: string;
}

export const OrganizationSwitcher = ({ organizationId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { onOpen } = useSettingsModal();

  const [openSheet, onChangeSheet] = useToggle(false);

  const { data: organizations } = useSuspenseQuery(trpc.members.getMany.queryOptions());

  const currentOrg = organizations.find((f) => f.id === organizationId);

  return (
    <>  
      <OrganizationCreateSheet open={openSheet} onOpenChange={onChangeSheet} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="!pl-1 !pr-1.5">
            <ImageAvatar 
              name={currentOrg?.name || ""}
              src={currentOrg?.image || ""}
              className="size-6 rounded"
              fallbackClassName="rounded uppercase text-sm font-medium bg-sky-400 text-white"
            />
            {currentOrg?.name}
            <ChevronsUpDownIcon className="size-3 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="p-0 w-52">
          <CommandSearch placeholder="Find organization...">
            <Command.Group className="p-1">
              {organizations.map((org) => (
                <Command.Item 
                  key={org.id}
                  onSelect={() => router.push(`/${org.id}`)}
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none data-[selected=true]:bg-accent data-[selected=true]:text-strong data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 cursor-pointer w-full h-7 gap-2"  
                >
                  <ImageAvatar 
                    name={org.name}
                    src={org.image || ""}
                    className="size-5 rounded"
                    fallbackClassName="rounded uppercase text-sm font-medium bg-sky-400 text-white"
                  />
                  {org.name}
                  {currentOrg?.id === org.id && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Button 
                        size="xsIcon" 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOpen();
                        }}
                      >
                        <Settings2Icon className="size-3" />
                      </Button>
                    </div>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
            <Separator />
            <Command.Group className="p-1">
              <Command.Item 
                onSelect={() => onChangeSheet(true)}
                className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none data-[selected=true]:bg-accent data-[selected=true]:text-strong data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 cursor-pointer w-full gap-2"  
              >
                <PlusIcon className="size-4" />
                New organization
              </Command.Item>
            </Command.Group>
          </CommandSearch>
        </PopoverContent>
      </Popover>
    </>
  );
}