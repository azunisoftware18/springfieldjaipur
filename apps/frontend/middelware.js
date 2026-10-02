import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLoginPage = pathname.startsWith("/login");

  // ❌ not logged in + dashboard access
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ already logged in + login page open
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}