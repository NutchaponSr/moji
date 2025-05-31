"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { organizationSchema, OrganizationSchema } from "@/modules/organization/schema";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrgImageUpload } from "../components/org-image-upload";

export const OrgView = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const createOrganization = useMutation(trpc.organizations.create.mutationOptions({
    onSuccess: ({ organizationId }) => {
      toast.success("Organization created");

      router.push(`/${organizationId}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  }));

  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: null,
    },
  });

  const onSubmit = (data: OrganizationSchema) => {
    createOrganization.mutate({ ...data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-3">
            <FormField 
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OrgImageUpload field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Moji"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField 
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="moji"
                      {...field}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={createOrganization.isPending}>
            Create organization
          </Button>
        </div>
      </form>
    </Form>
  );
}