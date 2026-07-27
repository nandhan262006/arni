import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [result] = await db
      .update(galleryImages)
      .set(body)
      .where(eq(galleryImages.id, parseInt(id)))
      .returning();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to update image" },
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
    await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
