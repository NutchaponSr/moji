import Link from "next/link";

import { ScrollBar } from "./scroll-bar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Logo } from "@/components/logo";

import { SignedIn } from "@/modules/auth/ui/components/signed-in";
import { UserButton } from "@/modules/auth/ui/components/user-button";
import { OrganizationSwitcher } from "@/modules/organizations/ui/components/organization-switcher";

interface Props {
  organizationId: string;
}

export const Header = async ({ organizationId }: Props) => {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-xl">
      <div className="flex flex-row h-14 md:h-16 items-center justify-between px-6 mx-auto max-w-5xl">
        <div className="flex flex-row items-center gap-2">
          <Logo />
          <SignedIn>
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
            <OrganizationSwitcher organizationId={organizationId} />
          </SignedIn>
          <div className="flex flex-row items-center gap-2 mx-2">
            <Button asChild variant="ghost">
              <Link href={`/${organizationId}/overviews`}>
                Overviews
              </Link>
            </Button>
          </div>
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <ScrollBar />
    </header>
  );
}