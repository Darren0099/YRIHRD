import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, authMode, verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/login")) return NextResponse.next();

  const mode = authMode();
  if (mode === "open") return NextResponse.next();
  if (mode === "misconfigured") return NextResponse.redirect(new URL("/login", req.url));

  if (await verifyToken(req.cookies.get(COOKIE)?.value)) return NextResponse.next();

  const url = new URL("/login", req.url);
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
