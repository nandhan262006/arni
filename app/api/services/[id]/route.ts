import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    const fields = ["title", "description", "slug", "icon", "imageUrl", "order"] as const;
    for (const f of fields) {
      if (f in body) allowed[f] = body[f];
    }
    const [result] = await db
      .update(services)
      .set(allowed)
      .where(eq(services.id, parseInt(id, 10)))
      .returning();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to update service" },
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
    await db.delete(services).where(eq(services.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
