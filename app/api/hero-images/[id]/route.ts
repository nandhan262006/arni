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
    if (typeof body.url === "string") data.url = body.url;
    if (typeof body.alt === "string") data.alt = body.alt;
    if (typeof body.storageKey === "string") data.storageKey = body.storageKey;
    if (typeof body.active === "boolean") data.active = body.active;
    if (typeof body.order === "number") data.order = body.order;

    const result = await prisma.heroImage.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (isNotFoundError(err)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return jsonError("Failed to update hero image");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const { id } = await params;
    const existing = await prisma.heroImage.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.heroImage.delete({ where: { id: existing.id } });
    if (existing.storageKey) {
      await deleteR2Object(existing.storageKey);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return jsonError("Failed to delete hero image");
  }
}
