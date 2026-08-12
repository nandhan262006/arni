import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const all = searchParams.get("all");

    if (all !== "true" && published !== "true") {
      const result = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(result);
    }

    if (published === "true") {
      const result = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(result);
    }

    const result = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch posts");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const slug =
      body.slug ||
      (typeof body.title === "string"
        ? body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : "");

    const result = await prisma.post.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt ?? "",
        content: body.content ?? "",
        coverImage: body.coverImage ?? null,
        published: body.published ?? false,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create post");
  }
}
