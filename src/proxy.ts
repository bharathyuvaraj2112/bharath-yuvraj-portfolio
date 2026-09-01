import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session")?.value;
  const isAuthenticated = adminSession === "true";

  // Redirect /login/dashboard and /login/* shortcuts to /admin equivalent
  if (pathname === "/login/dashboard") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", "/admin/dashboard");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname === "/login" || pathname.startsWith("/login/")) {
    const targetPath = pathname.replace(/^\/login/, "/admin");
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", targetPath === "/admin/login" ? "/admin/dashboard" : targetPath);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and accessing /admin/login, redirect to dashboard
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/login/:path*", "/login"],
};

