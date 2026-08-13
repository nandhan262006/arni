import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

const ALLOWED_TYPES = ["gallery", "films", "services"];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where = type && ALLOWED_TYPES.includes(type) ? { type } : undefined;
    const result = await prisma.category.findMany({
      where,
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch categories");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const type = typeof body.type === "string" ? body.type : "";

    if (!name || name.length > 50) {
      return NextResponse.json(
        { error: "Category name is required (max 50 characters)." },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid category type." },
        { status: 400 }
      );
    }

    const slug = typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(name);

    const result = await prisma.category.create({
      data: {
        name,
        slug,
        type,
        order: typeof body.order === "number" ? body.order : 0,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create category");
  }
}
