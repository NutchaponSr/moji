import { ScrollBar } from "./scroll-bar";

import { Separator } from "@/components/ui/separator";

import { Logo } from "@/components/logo";

import { SignedIn } from "@/modules/auth/ui/components/signed-in";
import { OrganizationSwitcher } from "@/modules/organization/ui/components/organization-switcher";

interface Props {
  organizationId: string;
}

export const Header = ({ organizationId }: Props) => {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-xl">
      <div className="flex flex-row h-14 md:h-16 items-center justify-between px-6 mx-auto max-w-5xl">
        <div className="flex flex-row items-center gap-2">
          <Logo />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <OrganizationSwitcher organizationId={organizationId} />
        </div>
        <div>
          User button
        </div>
      </div>
      <ScrollBar />
    </header>
  );
}