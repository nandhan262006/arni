import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(services)
      .orderBy(asc(services.order));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const allowed = {
      title: body.title,
      description: body.description ?? "",
      slug: body.slug,
      icon: body.icon ?? "camera",
      imageUrl: body.imageUrl ?? null,
      order: body.order ?? 0,
    };
    const [result] = await db.insert(services).values(allowed).returning();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
