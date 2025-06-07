import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { DEFAULT_REDIRECT } from "@/modules/auth/constants";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    return redirect(DEFAULT_REDIRECT);
  }

  return (
    <div>

    </div>
  );
}

export default Page;