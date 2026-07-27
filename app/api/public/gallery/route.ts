import { NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conditions = [];

    if (category && category !== "all") {
      conditions.push(eq(galleryImages.category, category));
    }
    if (featured === "true") {
      conditions.push(eq(galleryImages.featured, true));
    }

    let query = db.select().from(galleryImages).$dynamic();

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query
      .orderBy(asc(galleryImages.order))
      .limit(limit);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
