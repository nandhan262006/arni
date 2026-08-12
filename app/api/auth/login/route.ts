import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({ orderBy: { id: "asc" } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createToken(user.id);
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
