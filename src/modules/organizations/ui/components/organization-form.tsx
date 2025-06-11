import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useZodForm } from "@/hooks/use-zod-form";

import { Button } from "@/components/ui/button";

import { FormGenerator } from "@/components/form-generator";

import { OrgImageUpload } from "@/modules/organizations/ui/components/organization-image-upload";

import { organizationSchema } from "@/modules/organizations/schema";

export const OrganizationForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createOrganization = useMutation(trpc.organizations.create.mutationOptions({
    onSuccess: ({ organizationId }) => {
      toast.success("Organization created");
      queryClient.invalidateQueries(trpc.organizations.current.queryOptions({ organizationId }));

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
      image: null,
    }
  );

  return (
    <form 
      onSubmit={onFormSubmit}
      className="w-full flex flex-col gap-3"
    >
      <FormGenerator
        name="image"
        inputType="custom"
        label="Logo"
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
      <Button type="submit" variant="primary">
        Create organization
      </Button>
    </form>
  );
}