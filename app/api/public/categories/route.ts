import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

const ALLOWED_TYPES = ["gallery", "films", "services"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await prisma.category.findMany({
      where: { type },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { name: true, slug: true },
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch categories");
  }
}
