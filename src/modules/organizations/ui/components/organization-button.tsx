"use client";

import { ImageAvatar } from "@/components/image-avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { SIGN_IN_URL } from "@/modules/auth/constants";
import { useSidebarStore } from "@/modules/layouts/store/use-sidebar-store";
import { useSettingsModal } from "@/store/use-settings-modal";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronDownIcon, SettingsIcon, SidebarIcon, UserPlus2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  organizationId: string;
}

export const OrganizationButton = ({ organizationId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const pathname = usePathname();
  
  const { onOpen } = useSettingsModal();
  const { collapse } = useSidebarStore();

  const { data: session } = authClient.useSession();
  const callbackUrl = encodeURIComponent(pathname);

  const { data: organizations } = useSuspenseQuery(trpc.members.getMany.queryOptions());
  const { data: organization } = useSuspenseQuery(trpc.organizations.current.queryOptions({ organizationId }));

  const memberCount = organization.members.length;

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(`${SIGN_IN_URL}?callbackUrl=${callbackUrl}`)
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div role="button" className="select-none transition flex items-center min-w-0 h-8 w-auto p-2 hover:bg-sidebar-accent">
          <div className="flex items-center w-full text-sm min-h-7 h-8.5 py-1 overflow-hidden gap-2">
            <div className="shrink-0 grow-0 size-5.5 flex items-center justify-center">
              <ImageAvatar 
                src={organization.image || ""}
                name={organization.name}
                className="rounded size-5.5"
                fallbackClassName="rounded text-sm bg-sky-400 text-white"
              />
            </div>
            <div className="flex-1 whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
              <div className="flex items-center justify-start">
                <span className="text-sm whitespace-nowrap text-ellipsis overflow-hidden leading-5 font-medium">
                  {organization.name}
                </span>
                <div className="grow-0 shrink-0 size-4 ml-1">
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center h-full ml-auto mr-0">
            <div className="inline-flex items-center gap-0.5">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  collapse();
                }} 
                className="transition inline-flex items-center justify-center shrink-0 rounded size-7 relative hover:bg-sidebar-accent text-muted-foreground hover:text-primary opacity-0 group-hover/sidebar:opacity-100"
              >
                <SidebarIcon className="size-5 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" alignOffset={6} className="w-64 p-0">
        <div className="p-3 flex flex-col gap-3">
          <div className="flex flex-row items-center justify-start gap-2 w-full">
            <ImageAvatar
              className="rounded size-8.5" 
              name={organization.name}
              src={organization.image || ""}
            />
            <div className="flex flex-col gap-0 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-left text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                {organization.name}
              </span>
                <span className="text-left text-tertiary text-xs whitespace-nowrap overflow-hidden text-ellipsis first-letter:uppercase">
                {organization.plan} Plan · {memberCount} member
                </span>
            </div>
          </div>
          <div className="inline-flex gap-2">
            <Button size="xs" variant="outline">
              <SettingsIcon className="size-3.5" />
              Settings
            </Button>
            <Button size="xs" variant="outline" onClick={onOpen}>
              <UserPlus2Icon className="size-3.5" />
              Invite members
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-px p-1">
          {session?.user.email && (
            <p className="px-2 my-1 text-xs font-medium text-tertiary">
              {session.user.email}
            </p>
          )}
          {organizations.map((org) => (
            <Button 
              key={org.id} 
              size="sm" 
              variant="item" 
              onClick={() => router.push(`/${org.id}`)}
            >
              <ImageAvatar 
                name={org.name}
                src={org.image ?? ""}
                className="size-5 rounded"
                fallbackClassName="rounded uppercase text-sm font-medium bg-sky-400 text-white"
              />
              <p className="text-primary text-sm leading-5 whitespace-nowrap overflow-hidden text-ellipsis">
                {org.name}
              </p>
              {organizationId === org.id && (
                <CheckIcon className="size-3 ml-auto" />
              )}
            </Button>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-px p-1">
          <Button 
            size="sm" 
            variant="item" 
            className="font-medium h-6"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 