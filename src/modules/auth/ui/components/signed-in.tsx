import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Props {
  children: React.ReactNode;
}

export const SignedIn = async ({ children }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return (
    <>{children}</>
  );
}