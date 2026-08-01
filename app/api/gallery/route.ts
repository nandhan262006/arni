import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let result;
    if (category && category !== "all") {
      result = await db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.category, category))
        .orderBy(asc(galleryImages.order));
    } else {
      result = await db
        .select()
        .from(galleryImages)
        .orderBy(asc(galleryImages.order));
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const allowed = {
      cloudinaryId: body.cloudinaryId,
      url: body.url,
      thumbnailUrl: body.thumbnailUrl ?? null,
      width: body.width ?? null,
      height: body.height ?? null,
      alt: body.alt ?? "",
      category: body.category ?? "wedding",
      featured: body.featured ?? false,
      order: body.order ?? 0,
    };
    const [result] = await db.insert(galleryImages).values(allowed).returning();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
