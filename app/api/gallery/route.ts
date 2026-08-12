import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const result = await prisma.galleryImage.findMany({
      where: category && category !== "all" ? { category } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch gallery");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const result = await prisma.galleryImage.create({
      data: {
        storageKey: body.storageKey,
        url: body.url,
        thumbnailUrl: body.thumbnailUrl ?? null,
        width: body.width ?? null,
        height: body.height ?? null,
        alt: body.alt ?? "",
        category: body.category ?? "wedding",
        featured: body.featured ?? false,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create gallery image");
  }
}
