"use client";

import Link from "next/link";
import VerificationInput from "react-verification-input";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { DEFAULT_REDIRECT } from "@/modules/auth/constants";

interface Props {
  invitationId: string;
}

export const InviteView = ({ invitationId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  
  const { data: invitation } = useSuspenseQuery(trpc.invitations.getOne.queryOptions({ invitationId }));

  const join = useMutation(trpc.members.create.mutationOptions());

  const [error, setError] = useState<string | null>(null);

  const handleComplete = (inviteCode: string) => {
    setError(null);

    if (inviteCode !== invitation.inviteCode) {
      setError("Invite code does not match");
      return;
    }

    join.mutate({
      organizationId: invitation.organizationId,
      role: invitation.role,
    }, {
      onSuccess: () => {
        router.replace(`/${invitation.organizationId}`);
      },
    });
  }

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
      <div className="flex flex-col gap-y-2 items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">
          Join {invitation.organization.name}
        </h1>
        <p className="text-muted-foreground">
          Enter the organization code to join
        </p>
      </div>

      <div className="flex flex-col gap-y-2 w-full">
        <VerificationInput 
          autoFocus
          length={6}
          onComplete={handleComplete}
          classNames={{
            container: cn("flex gap-x-2", join.isPending && "opacity-50 cursor-not-allowed"),
            character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
        />
        {error && (
          <p className="text-sm text-[#eb5757] text-center underline">
            {error}
          </p>
        )}
      </div>
      <div className="flex gap-x-4">
        <Button
          asChild
          size="lg"
          variant="outline"
        >
          <Link href={DEFAULT_REDIRECT}>
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}