import { NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(testimonials);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const allowed = {
      clientName: body.clientName,
      event: body.event ?? "",
      rating: body.rating ?? 5,
      text: body.text,
      avatarUrl: body.avatarUrl ?? null,
    };
    const [result] = await db.insert(testimonials).values(allowed).returning();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
