import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10") || 10, 1),
      100
    );

    if (slug) {
      const result = await prisma.post.findUnique({ where: { slug } });
      if (!result) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    const result = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch posts");
  }
}
