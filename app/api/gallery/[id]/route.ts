import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError, isNotFoundError } from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    const fields = ["storageKey", "url", "thumbnailUrl", "width", "height", "alt", "category", "featured", "order"] as const;
    for (const f of fields) {
      if (f in body) data[f] = body[f];
    }
    const result = await prisma.galleryImage.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to update image");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const { id } = await params;
    const image = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!image) return jsonError("Not found", 404);

    await prisma.galleryImage.delete({ where: { id: image.id } });
    await deleteR2Object(image.storageKey);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to delete image");
  }
}
