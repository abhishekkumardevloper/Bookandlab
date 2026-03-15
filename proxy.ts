import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/handler/sign-in") ||
    request.nextUrl.pathname.startsWith("/handler/sign-up");

  const stackToken =
    request.cookies.get("stack-cookie") ||
    request.cookies.get("__Secure-stack-token");

  if (isAuthPage && stackToken) {
    return NextResponse.redirect(new URL("/auth-callback", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/handler/sign-in",
    "/handler/sign-up",
    "/student/:path*",
    "/mentor/:path*",
    "/admin/:path*",
  ],
};
