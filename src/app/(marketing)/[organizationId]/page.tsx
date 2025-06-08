import { redirect } from "next/navigation";

import { caller } from "@/trpc/server";

import { DEFAULT_REDIRECT } from "@/modules/auth/constants";

interface Props {
  params: Promise<{ organizationId: string }>;
}

export const Page = async ({ params }: Props) => {
  const { organizationId } = await params;

  const mem = await caller.members.check({ organizationId });

  if (!mem) {
    redirect(DEFAULT_REDIRECT);
  }

  return (
    <div className="mt-16">
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(mem, null, 2)}
      </pre>
    </div>
  );
}

export default Page;