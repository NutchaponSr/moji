"use client";

import { ContrastIcon, LoaderIcon, Settings2Icon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuPortal, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { ImageAvatar } from "@/components/image-avatar";

import { SIGN_IN_URL } from "@/modules/auth/constants";
import { useSettingsModal } from "@/store/use-settings-modal";

export const UserButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { onOpen } = useSettingsModal();

  const callbackUrl = encodeURIComponent(pathname);

  const { data: session, isPending } = authClient.useSession();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(`${SIGN_IN_URL}?callbackUrl=${callbackUrl}`)
      }
    });
  };

  if (isPending) {
    return <LoaderIcon className="size-5 animate-spin" />
  }

  if (!session || !session.user.image) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border rounded-full">
          <ImageAvatar 
            name={session.user.name}
            src={session.user.image}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-1.5 border-b">
          <span className="font-medium">{session.user.name}</span>
          <span className="text-[#666] text-xs">{session.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={onOpen} className="rounded-none px-3 py-1.5">
          <Settings2Icon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-none px-3 py-1.5 flex items-center gap-2">
            <ContrastIcon className="size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="p-0 min-w-24" sideOffset={6}>
              <DropdownMenuItem className="rounded-none px-3 py-1.5">
                Light
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-none px-3 py-1.5">
                Dark
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem onClick={handleLogout} className="rounded-t-none px-3 py-1.5">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};