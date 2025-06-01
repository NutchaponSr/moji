"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { useZodForm } from "@/hooks/use-zod-form";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { FormGenerator } from "@/components/form-generator";

import { OrgImageUpload } from "@/modules/organization/ui/components/org-image-upload";

import { organizationSchema } from "@/modules/organization/schema";

export const OrgView = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data } = useSuspenseQuery(trpc.organizations.getOne.queryOptions());

  const createOrganization = useMutation(trpc.organizations.create.mutationOptions({
    onSuccess: ({ organizationId }) => {
      toast.success("Organization created");

      router.push(`/${organizationId}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  }));

  const { onFormSubmit, setValue, ...form } = useZodForm<typeof organizationSchema>(
    organizationSchema,
    createOrganization.mutate,
    {
      name: "",
      slug: "",
      image: "",
    }
  );

  useEffect(() => {
    if (data) {
      router.push(`/${data.organizationId}`);
    }
  }, [data, router]);

  if (data) return null;

  return (
    <form 
      onSubmit={onFormSubmit}
      className="w-full flex flex-col gap-3"
    >
      <FormGenerator
        name="image"
        inputType="custom"
        {...form}
      >
        <OrgImageUpload setValue={setValue} />
      </FormGenerator>
      <FormGenerator 
        name="name"
        label="Name"
        inputType="input"
        placeholder="Moji"
        {...form}
        />
      <FormGenerator 
        name="slug"
        label="Slug"
        inputType="input"
        placeholder="moji"
        {...form}
      />
      <Button type="submit">
        Create organization
      </Button>
    </form>
  );
}
