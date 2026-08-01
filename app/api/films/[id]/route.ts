import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { films } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    const fields = ["title", "description", "videoUrl", "thumbnailUrl", "category", "featured", "order"] as const;
    for (const f of fields) {
      if (f in body) allowed[f] = body[f];
    }
    const [result] = await db
      .update(films)
      .set(allowed)
      .where(eq(films.id, parseInt(id, 10)))
      .returning();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to update film" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(films).where(eq(films.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete film" },
      { status: 500 }
    );
  }
}
