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
    const [result] = await db
      .update(films)
      .set(body)
      .where(eq(films.id, parseInt(id)))
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
    await db.delete(films).where(eq(films.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete film" },
      { status: 500 }
    );
  }
}
