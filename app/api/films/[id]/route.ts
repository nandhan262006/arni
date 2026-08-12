import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError, isNotFoundError } from "@/lib/api";
import { deleteR2ObjectByUrl } from "@/lib/r2";

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
    const fields = ["title", "description", "videoUrl", "thumbnailUrl", "category", "featured", "order"] as const;
    for (const f of fields) {
      if (f in body) data[f] = body[f];
    }
    const result = await prisma.film.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to update film");
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
    const film = await prisma.film.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!film) return jsonError("Not found", 404);

    await prisma.film.delete({ where: { id: film.id } });
    await deleteR2ObjectByUrl(film.videoUrl);
    if (film.thumbnailUrl) {
      await deleteR2ObjectByUrl(film.thumbnailUrl);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to delete film");
  }
}
