"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { OrganizationForm } from "@/modules/organizations/ui/components/organization-form";

export const OrgView = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data } = useSuspenseQuery(trpc.organizations.getOne.queryOptions());

  useEffect(() => {
    if (data) {
      router.push(`/${data.organizationId}`);
    }
  }, [data, router]);

  if (data) return null;

  return <OrganizationForm />
}
