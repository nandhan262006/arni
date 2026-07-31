import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_PATHS = [
  "/api/gallery",
  "/api/films",
  "/api/services",
  "/api/testimonials",
  "/api/posts",
  "/api/messages",
  "/api/settings",
  "/api/upload",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const token = request.cookies.get("arni_admin_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const session = await verifyToken(token);
    if (!session) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("arni_admin_token");
      return response;
    }
    return NextResponse.next();
  }

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const isPublicContactSubmission =
      pathname === "/api/messages" && request.method === "POST";

    if (!isPublicContactSubmission) {
      const token = request.cookies.get("arni_admin_token")?.value;
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const session = await verifyToken(token);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/gallery/:path*", "/api/films/:path*", "/api/services/:path*", "/api/testimonials/:path*", "/api/posts/:path*", "/api/messages/:path*", "/api/settings/:path*", "/api/upload/:path*"],
};
