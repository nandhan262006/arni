import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.heroImage.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, url: true, alt: true },
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch hero images");
  }
}
