import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-user-id", userId.toString());

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};