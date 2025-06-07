import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_REDIRECT } from "./modules/auth/constants";

const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/org"];

export async function middleware(req: NextRequest) {
  const session = getSessionCookie(req);

  const isLoggedIn = !!session;
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isLoggedIn && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.url));
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/sign-in", "/auth/sign-up"]
}
