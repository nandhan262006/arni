import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const result = await prisma.film.findMany({
      where: category && category !== "all" ? { category } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch films");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const result = await prisma.film.create({
      data: {
        title: body.title ?? "",
        description: body.description ?? "",
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl ?? null,
        category: body.category ?? "modern",
        featured: body.featured ?? false,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create film");
  }
}
