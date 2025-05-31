"use client";

import { Icon } from "@iconify-icon/react";
import { useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

import { DEFAULT_REDIRECT } from "@/modules/auth/constants";

export const Socials = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const onSocial = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl || DEFAULT_REDIRECT,
    });
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full" onClick={() => onSocial("google")}>
        <Icon icon="flat-color-icons:google" />
        Google
      </Button>
      <Button variant="outline" className="w-full" onClick={() => onSocial("github")}>
        <Icon icon="logos:github-icon" />
        Github
      </Button>
    </div>
  );
}