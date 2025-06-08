"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

import { SIGN_IN_URL } from "@/modules/auth/constants";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end w-full px-24">
      <Button
        variant="secondary"
        onClick={() => authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push(SIGN_IN_URL),
          },
        })}
      >
        Sign out
      </Button>
    </div>
  )
}