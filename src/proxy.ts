import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./app/actions/auth/actions";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const requestRoute = request.nextUrl.pathname;

  // Allow static assets and public files to pass through without authentication
  if (
    requestRoute.startsWith("/_next/") ||
    requestRoute.startsWith("/static/") ||
    requestRoute.startsWith("/public/") ||
    requestRoute.includes(".") || // Files with extensions (CSS, JS, images, etc.)
    requestRoute === "/login" ||
    requestRoute === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const session = await getSession();
  if (session) {
    return NextResponse.next();
  }

  if (!session && requestRoute !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
