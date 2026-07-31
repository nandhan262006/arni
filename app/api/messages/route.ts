import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MESSAGE_RATE_LIMIT = 5;
const MESSAGE_RATE_WINDOW_MS = 10 * 60 * 1000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread");

    if (unreadOnly === "true") {
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.read, false))
        .orderBy(desc(messages.createdAt));
      return NextResponse.json(result);
    }

    const result = await db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`contact:${ip}`, MESSAGE_RATE_LIMIT, MESSAGE_RATE_WINDOW_MS);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      }
    );
  }

  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Name is required (max 100 characters)." }, { status: 400 });
  }
  if (!email || email.length > 200 || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (phone.length > 30) {
    return NextResponse.json({ error: "Phone number is too long." }, { status: 400 });
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters." },
      { status: 400 }
    );
  }

  try {
    const [result] = await db
      .insert(messages)
      .values({ name, email, phone, message })
      .returning();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
