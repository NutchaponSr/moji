import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { DEFAULT_REDIRECT } from "./modules/auth/constants";

const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/org"];

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");

      if (callbackUrl) {
        return NextResponse.redirect(new URL(decodeURIComponent(callbackUrl), req.url));
      }

      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }

    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/sign-in", "/auth/sign-up"]
}