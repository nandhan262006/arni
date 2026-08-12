import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch services");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const result = await prisma.service.create({
      data: {
        title: body.title,
        description: body.description ?? "",
        slug: body.slug,
        icon: body.icon ?? "camera",
        imageUrl: body.imageUrl ?? null,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create service");
  }
}
