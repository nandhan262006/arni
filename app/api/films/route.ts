import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { films } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let result;
    if (category && category !== "all") {
      result = await db
        .select()
        .from(films)
        .where(eq(films.category, category))
        .orderBy(asc(films.order));
    } else {
      result = await db
        .select()
        .from(films)
        .orderBy(asc(films.order));
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch films" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.insert(films).values(body).returning();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create film" },
      { status: 500 }
    );
  }
}
