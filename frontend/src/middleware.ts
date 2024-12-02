import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "./lib/axios";

export async function middleware(request: NextRequest) {
  const cookies = request.headers.get("Cookie")?.split("; ") || "";
  const refreshToken = cookies[0] || "";
  const accessToken = cookies[1] || "";
  const { pathname } = request.nextUrl;

  if (!accessToken) {
    try {
      await axios.get("/api/v1/auth/refresh", {
        withCredentials: true,
        headers: { Cookie: refreshToken },
      });
      return NextResponse.next();
    } catch (error) {
      console.error(error);
      if (pathname === "/login" || pathname === "/register") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    const previousPage = request.headers.get("referer") || "/dashboard";
    return NextResponse.redirect(new URL(previousPage, request.url));
  }

  // Continue to the requested page if access token exists
  return NextResponse.next();
}

// Config to match paths
export const config = {
  matcher: [
    "/login",
    "/register",
    "/orders/:path*",
    "/history-order/:path*",
    "/profile/:path*",
  ],
};
