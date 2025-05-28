"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { SIGN_IN_URL, SIGN_UP_URL } from "@/modules/auth/constants";

export const SwitchAuth = () => {
  const pathname = usePathname();

  return (
    <div className="absolute right-0 top-0 flex h-[4em] items-center justify-end bg-background px-5 lg:h-20">
      <div role="tablist" className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        <Button asChild variant={pathname === SIGN_IN_URL ? "outline" : "ghost"} size="sm">
          <Link href="/auth/sign-in">
            Sign in
          </Link>
        </Button>
        <Button asChild variant={pathname === SIGN_UP_URL ? "outline" : "ghost"} size="sm">
          <Link href="/auth/sign-up">
            Sign up
          </Link>
        </Button>
      </div>  
    </div>
  );
}