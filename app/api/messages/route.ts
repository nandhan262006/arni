import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread");

    let query = db.select().from(messages).orderBy(desc(messages.createdAt));

    if (unreadOnly === "true") {
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.read, false))
        .orderBy(desc(messages.createdAt));
      return NextResponse.json(result);
    }

    const result = await query;
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.insert(messages).values(body).returning();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
