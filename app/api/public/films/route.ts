import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "50") || 50, 1),
      100
    );

    const where: { category?: string; featured?: boolean } = {};
    if (category && category !== "all") where.category = category;
    if (featured === "true") where.featured = true;

    const result = await prisma.film.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { order: "asc" },
      take: limit,
    });

    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch films");
  }
}
