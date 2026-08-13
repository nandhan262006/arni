import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.heroImage.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch hero images");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const result = await prisma.heroImage.create({
      data: {
        storageKey: body.storageKey,
        url: body.url,
        alt: body.alt ?? "",
        active: body.active ?? true,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create hero image");
  }
}
