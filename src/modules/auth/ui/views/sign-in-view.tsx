"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { 
  Form, 
  FormControl, 
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signIn, SignIn } from "@/modules/auth/schema";

export const SignInView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<SignIn>({
    resolver: zodResolver(signIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ ...data }: SignIn) => {
    await authClient.signIn.email({
      ...data,
      callbackURL: callbackUrl || "/",
    }, {
      onSuccess: () => {
        router.push(callbackUrl || "/");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div className="grid gap-3">
          <div className="grid gap-3">
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="john.doe@example.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="*******"
                      {...field}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}