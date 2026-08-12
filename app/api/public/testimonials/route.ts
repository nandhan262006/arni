import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.testimonial.findMany();
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch testimonials");
  }
}
