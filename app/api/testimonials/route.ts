import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { requireApiAuth, jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.testimonial.findMany();
    return NextResponse.json(result);
  } catch {
    return jsonError("Failed to fetch testimonials");
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireApiAuth();
    if (authError) return authError;

    const body = await request.json();
    const result = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        event: body.event ?? "",
        rating: body.rating ?? 5,
        text: body.text,
        avatarUrl: body.avatarUrl ?? null,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    return jsonError("Failed to create testimonial");
  }
}
