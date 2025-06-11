import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  sticky?: boolean;
}

export const Logo = ({ sticky }: Props) => {
  return (
    <Link 
      href="/" 
      className={cn(
        "flex flex-none items-center gap-2 py-1.5 px-3",
        sticky && "fixed left-3 top-5 z-100",
      )}
    >
      <Image 
        src="/logo.svg"
        alt="Logo"
        width={28}
        height={28}
        className="block dark:hidden"
      />
      <Image 
        src="/logo-dark.svg"
        alt="Logo"
        width={28}
        height={28}
        className="hidden dark:block"
      />
      <p className="font-medium text-primary text-xl">
        Moji
      </p>
    </Link>
  );
}