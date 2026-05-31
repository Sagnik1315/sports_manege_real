import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = {
  admin: "/admin",
  coach: "/coach",
  athlete: "/athlete",
};

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/athlete-register",
  "/coach-register",
  "/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname === r)) {
    return NextResponse.next();
  }

  // Check for auth session token cookie set by our client
  const token = request.cookies.get("scm-auth-token")?.value;
  const role = request.cookies.get("scm-user-role")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  if (pathname.startsWith(PROTECTED_ROUTES.admin) && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith(PROTECTED_ROUTES.coach) && role !== "coach") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith(PROTECTED_ROUTES.athlete) && role !== "athlete") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
