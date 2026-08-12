import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const result = await prisma.service.findUnique({ where: { slug } });
      if (!result) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    const result = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch services");
  }
}
