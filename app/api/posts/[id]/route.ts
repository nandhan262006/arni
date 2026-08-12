import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError, isNotFoundError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch post");
  }
}

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
    const fields = ["title", "slug", "excerpt", "content", "coverImage", "published"] as const;
    for (const f of fields) {
      if (f in body) data[f] = body[f];
    }
    const result = await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to update post");
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
    await prisma.post.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) return jsonError("Not found", 404);
    return jsonError("Failed to delete post");
  }
}
