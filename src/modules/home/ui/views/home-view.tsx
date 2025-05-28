"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session?.user.name}</p>
      <Button onClick={() => authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/auth/sign-in")
        }
      })}>
        Sign out
      </Button>
    </div>
  );
}