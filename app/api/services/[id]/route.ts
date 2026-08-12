import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError, isNotFoundError } from "@/lib/api";

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
    const fields = ["title", "description", "slug", "icon", "imageUrl", "order"] as const;
    for (const f of fields) {
      if (f in body) data[f] = body[f];
    }
    const result = await prisma.service.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to update service");
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
    await prisma.service.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to delete service");
  }
}
