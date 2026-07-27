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
