import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { jsonError } from "@/lib/api";

export async function GET() {
  try {
    const result = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of result) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json(settingsMap);
  } catch {
    return jsonError("Failed to fetch settings");
  }
}
